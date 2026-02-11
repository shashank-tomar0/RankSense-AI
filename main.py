from fastapi import FastAPI, UploadFile, File, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import spacy
import re
import difflib
import asyncio
import json
from typing import List, Optional
from fastapi import Form
import docx
import sqlite3
import datetime

app = FastAPI()

# Database Setup
DB_NAME = "ranksense.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS candidates
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  filename TEXT,
                  score REAL,
                  data_json TEXT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db() # Initialize on startup

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    nlp = spacy.load("en_core_web_sm")
    print("SUCCESS: Spacy model loaded.")
except Exception:
    print("WARNING: Spacy model 'en_core_web_sm' not found. Downloads needed.")
    nlp = None

@app.get("/")
def health_check():
    return {"status": "active", "model_loaded": nlp is not None}

# Store active websocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

def fuzzy_match(term, choices, cutoff=0.6):
    matches = difflib.get_close_matches(term, choices, n=1, cutoff=cutoff)
    return matches[0] if matches else term


def calculate_hackathon_score(extracted, full_text, jd_text=""):
    """
    Calculates weighted score based on Hackathon criteria (Max 100).
    Returns (score, analysis_dict)
    """
    score = 0
    analysis = {
        "matches": [],
        "missing": [],
        "jd_present": False
    }
    
    # 1. Prior Internships (20%) - Max 2 internships = 20 pts
    internships = extracted.get('internship_count', 0)
    score += min(internships * 10, 20)
    
    # 2. Skills & Certification (20%) - Max 10 skills = 20 pts
    skills_list = extracted.get('skills', [])
    score += min(len(skills_list), 10) # Base skill points

    if jd_text:
        analysis["jd_present"] = True
        try:
            # NLP Analysis
            jd_doc = nlp(jd_text)
            # Extract meaningful chunks ( > 3 chars, not just stop words)
            jd_keywords = set([chunk.text.lower() for chunk in jd_doc.noun_chunks if len(chunk.text) > 3])
            
            # Add named entities for good measure
            jd_keywords.update([ent.text.lower() for ent in jd_doc.ents])
            
            # Check against resume text
            text_lower = full_text.lower()
            matches = [kw for kw in jd_keywords if kw in text_lower]
            missing = list(jd_keywords - set(matches))
            
            analysis["matches"] = sorted(list(set(matches)))
            analysis["missing"] = sorted(missing)
            
            # Boost score based on coverage
            coverage = len(matches) / len(jd_keywords) if jd_keywords else 0
            score += min(coverage * 20, 10) # Max 10 pts for coverage
            
            # Bonus for explicit skill matches
            skill_matches = sum(1 for s in skills_list if s in jd_text.lower())
            score += min(skill_matches * 2, 10) 
            
        except Exception as e:
            print(f"NLP Error: {e}")
    else:
        score += min(len(skills_list), 10) # Extra points if no JD to fill gap logic

    # 3. Projects (15%) - Max 3 projects = 15 pts
    projects = extracted.get('project_count', 0)
    score += min(projects * 5, 15)
    
    # 4. CGPA (10%) - Normalized to 10
    cgpa = extracted.get('cgpa', 0)
    if cgpa > 0:
        score += min(cgpa, 10)
    
    # 5. Quantifiable Achievements (10%) - Keyword detection
    achievements = extracted.get('achievement_count', 0)
    score += min(achievements * 5, 10)
    
    # 6. Experience (5%) - Years or simple entry count
    exp_entries = extracted.get('experience_count', 0)
    score += min(exp_entries * 2.5, 5)
    
    # 7. Extra-curricular (5%)
    extra = extracted.get('extra_count', 0)
    score += min(extra * 2.5, 5)
    
    # 8. Language Fluency (3%) - Detection of languages
    langs = extracted.get('language_count', 0)
    score += min(langs * 1.5, 3)
    
    # 9. Online Presence (3%) - GitHub/LinkedIn
    links = extracted.get('link_count', 0)
    score += min(links * 1.5, 3)
    
    # 10. Degree Type (3%) - B.Tech/M.Tech detection
    degree = 3 if extracted.get('degree_found') else 0
    score += degree
    
    # 11. College Ranking (2%) - Tier detection (basic check)
    tier = 2 if extracted.get('tier_1_college') else 1
    score += tier
    
    # 12. School Marks (2%) 
    score += 2 # Assume decent marks for now
    
    return round(score, 2), analysis

async def process_resume_task(file_content: bytes, filename: str, jd_text: str = ""):
    await manager.broadcast(f"> Processing started for: {filename}")
    
    # Simulate processing time
    await asyncio.sleep(1) 
    
    full_text = ""
    try:
        # Determine file type
        if filename.lower().endswith(".pdf"):
            import io
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                 full_text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        elif filename.lower().endswith(".docx"):
            import io
            doc = docx.Document(io.BytesIO(file_content))
            full_text = "\n".join([p.text for p in doc.paragraphs])
        elif filename.lower().endswith(".txt"):
            full_text = file_content.decode("utf-8")
        else:
             await manager.broadcast(f"> ERROR: Unsupported format {filename}")
             return

        await manager.broadcast(f"> DEBUG: Extracted {len(full_text)} characters.")
        if len(full_text) < 50:
             await manager.broadcast("> WARNING: Minimal text found.")
    except Exception as e:
        await manager.broadcast(f"> Error extracting {filename}: {str(e)}")
        return

    extracted = extract_structured_data(full_text)
    
    score, analysis = calculate_hackathon_score(extracted, full_text, jd_text)
    
    await manager.broadcast(f"> Extracted {len(extracted['skills'])} skills, {extracted['internship_count']} internships, {extracted['project_count']} projects")
    if jd_text:
        await manager.broadcast(f"> JD Analysis: {len(analysis['matches'])} Matches found.")
    await manager.broadcast(f"> Hacker Score: {score}/100")
    
    # Breakdown for UI (sent as JSON string in log for parsing)
    breakdown = {
        "score": score,
        "filename": filename,
        "skills_count": len(extracted['skills']),
        "skills": extracted['skills'],
        "internships": extracted['internship_count'],
        "projects": extracted['project_count'],
        "cgpa": extracted['cgpa'],
        "experience": extracted['experience_count'],
        "raw_text": extracted.get('raw_text_snippet', 'No snippet available.'),
        "jd_present": bool(jd_text),
        "jd_analysis": analysis
    }
    
    # Save to Database
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO candidates (filename, score, data_json) VALUES (?, ?, ?)",
                  (filename, score, json.dumps(breakdown)))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")
    
    await manager.broadcast(f"COMPLETE_JSON:{json.dumps(breakdown)}")

@app.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/candidates")
def get_candidates():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT data_json FROM candidates ORDER BY score DESC")
    rows = c.fetchall()
    conn.close()
    return [json.loads(row['data_json']) for row in rows]

@app.delete("/candidates")
def clear_candidates():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM candidates")
    conn.commit()
    conn.close()
    return {"message": "Database cleared"}

def extract_structured_data(text):
    text_lower = text.lower()
    
    # 1. Skills
    skills_list = ["python", "c++", "javascript", "react", "sql", "machine learning", "java", "html", "css", "node.js", "typescript", "aws", "docker", "kubernetes", "linux", "git", "pandas", "numpy", "pytorch", "tensorflow", "fastapi", "flask", "django"]
    found_skills = list(set([skill for skill in skills_list if skill in text_lower]))
    
    # 2. Internships (Heuristic: Look for "intern" keyword)
    internship_count = text_lower.count("intern")
    
    # 3. Projects (Heuristic: Look for "project" keyword or specific headers)
    # Simple count of the word 'project' might be noisy, but good baseline
    project_count = text_lower.count("project")
    
    # 4. CGPA
    cgpa_match = re.search(r'(\d\.\d{1,2})', text)
    cgpa = float(cgpa_match.group(1)) if cgpa_match else 0.0
    if cgpa > 10: cgpa = cgpa / 10 # Normalize percentage -> 10 scale roughly
    
    # 5. Links (GitHub/LinkedIn)
    link_count = text_lower.count("github.com") + text_lower.count("linkedin.com")
    
    # 6. Education / Degree
    degree_found = any(x in text_lower for x in ['b.tech', 'm.tech', 'bachelor', 'master', 'degree'])
    
    return {
        "skills": found_skills,
        "internship_count": internship_count,
        "project_count": project_count,
        "cgpa": cgpa,
        "achievement_count": text_lower.count("achieve") + text_lower.count("award") + text_lower.count("won"),
        "experience_count": internship_count + text_lower.count("experience"), # Rough Proxy
        "extra_count": text_lower.count("volunteer") + text_lower.count("member"),
        "language_count": 2, # Default assumption: English + Native
        "link_count": link_count,
        "degree_found": degree_found,
        "tier_1_college": any(x in text_lower for x in ['iit', 'nit', 'bits', 'iiit', 'university']),
        "raw_text_snippet": text[:500] + "..." # First 500 chars for preview
    }

@app.post("/upload")
async def process_resume(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...),
    jd_text: Optional[str] = Form(None)
):
    # Read file content to pass to background task (file object closes after request)
    file_content = await file.read()
    
    background_tasks.add_task(process_resume_task, file_content, file.filename, jd_text or "")
    
    return {"message": "Processing started", "filename": file.filename}