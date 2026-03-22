<p align="center">
  <img src="https://img.shields.io/badge/AI-Groq_LLaMA_3.1-00C4B4?style=for-the-badge&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
</p>

# TalentScout AI — Neural Resume Intelligence

> **We don't just "read" resumes. We interrogate them.** TalentScout AI is an advanced, anti-manipulation hiring engine designed to evaluate 25+ resumes in under 10 seconds, scoring candidates deterministically across 12 factors while destroying AI-generated prompt injections and hidden text hacks.

In a world where standard ATS systems rely on dumb keyword matching—allowing candidates to cheat by hiding microscopic text in their PDFs—TalentScout acts as a **Forensic Auditor**, bringing absolute truth and transparency back to hiring.

---

## 🏗️ System Architecture

Our lightning-fast architecture orchestrates real-time analysis, parallel neural networks, and live WebSocket telemetry.

```mermaid
graph TD
    subgraph FRONTEND ["🖥️ Next.js Dashboard"]
        UI["Immersive 3D UI<br/>(Tailwind + Framer)"]
        AUTH["Clerk Auth<br/>(SSO / Email)"]
        WS_CLIENT["Live Telemetry<br/>(WebSocket)"]
    end

    subgraph BACKEND ["⚙️ FastAPI Core Engine"]
        API["REST API"]
        WSB["Live Broadcaster"]
        SEM["Parallel AI Orchestrator"]
    end

    subgraph PIPELINE ["🔬 The 8-Phase Forensic Pipeline"]
        direction TB
        P1["1. Dual-Engine PDF Extraction"]
        P2["2. Visual OCR Fallback"]
        P3["3. Hidden Text Detection"]
        P4["4. 7-Layer AI Security Firewall"]
        P5["5. 12-Factor Structural Extraction"]
        P6["6. Parallel Neural Analysis"]
        P7["7. Deterministic Scoring"]
        P8["8. Live Signal Dispatch"]
    end

    subgraph SERVICES ["🌐 Intelligence Layer"]
        GROQ["Groq (LLaMA 3.1)"]
        GITHUB["GitHub API"]
        DB[("Live SQLite")]
    end

    UI --> API
    API --> PIPELINE
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> P6
    P6 --> GROQ
    P6 --> GITHUB
    P6 --> P7
    P7 --> P8
    P8 --> DB
    P8 --> WSB
    WSB --> WS_CLIENT
    WS_CLIENT --> UI
```

---

## ⚡ Real-Time Upload Architecture

```mermaid
graph TD
    %% Styling
    classDef user fill:#6366f1,stroke:#4f46e5,color:#fff,stroke-width:2px
    classDef frontend fill:#0f172a,stroke:#38bdf8,color:#38bdf8,stroke-width:2px
    classDef backend fill:#1e293b,stroke:#a855f7,color:#e9d5ff,stroke-width:2px
    classDef db fill:#020617,stroke:#10b981,color:#a7f3d0,stroke-width:2px
    classDef ai fill:#020617,stroke:#f59e0b,color:#fde68a,stroke-width:2px
    classDef ext fill:#020617,stroke:#64748b,color:#cbd5e1,stroke-width:2px

    %% Nodes
    USER((User)):::user
    UI[Next.js Dashboard<br/>Uploads PDF/DOCX]:::frontend
    
    subgraph BACKEND ["FastAPI Engine"]
        API[POST /upload<br/>Accepts File & JD]:::backend
        
        subgraph P1 ["Phase 1: Dual-Engine Parser & Pre-Flight"]
            HASH[Generate SHA-256 Hash]:::backend
            EXTRACT_P[PyMuPDF<br/>Structural Layout]:::backend
            EXTRACT_PL[PDFPlumber<br/>Digital Text/Links]:::backend
            OCR{Sparse Text?<br/>< 200 chars}:::backend
            TESSERACT[Tesseract OCR @200DPI<br/>Background Thread]:::backend
        end
        
        subgraph P2 ["Phase 2: Security & Forensic Scan"]
            HIDDEN[Invisible Font Scanner<br/>Cross-ref raw vs visual]:::backend
            DUP[Duplicate Check<br/>Cosine Similarity]:::backend
            INJECT[LLM Prompt<br/>Injection Firewall]:::ai
        end

        subgraph P3 ["Phase 3: Neural Analysis (8x Parallel)"]
            T1[Career Details<br/>Internships/Projects]:::ai
            T2[Personal Info<br/>Name/Location]:::ai
            T3[Hireability<br/>Executive Summary]:::ai
            T4[Interview Pilot<br/>10 Custom Questions]:::ai
            T5[Culture Fit<br/>Behavioral Match]:::ai
            T6[Upsell<br/>Course Recommendations]:::ai
            T7[Parse Social links]:::backend
            GH[GitHub API<br/>Live Verification]:::ext
        end

        subgraph P4 ["Phase 4: Deterministic Scoring System"]
            BASE[Calculate 12-Factor Base Score]:::backend
            MULTI[Apply Tier-1 Multipliers]:::backend
            TRUST[Calculate Validated Trust Score]:::backend
        end
        
        DB[(SQLite DB<br/>JSON Blob & Stats)]:::db
        WS((WebSocket<br/>Live Broadcast)):::frontend
    end

    %% Flow Details
    USER -->|Uploads Resume| UI
    UI -->|Sends File| API
    API --> HASH
    
    HASH --> EXTRACT_P
    HASH --> EXTRACT_PL
    EXTRACT_P & EXTRACT_PL --> OCR
    OCR -->|Yes| TESSERACT
    OCR -->|No| P2
    TESSERACT --> P2
    
    P2 --> HIDDEN
    HIDDEN --> DUP
    DUP --> INJECT
    INJECT -->|Blocked| DB
    INJECT -->|Cleared| P3
    
    P3 --> T1 & T2 & T3 & T4 & T5 & T6 & T7
    T7 --> |Extracted Username| GH
    
    T1 & T2 & T3 & T4 & T5 & T6 & GH --> P4
    P4 --> BASE
    BASE --> MULTI
    MULTI --> TRUST
    
    TRUST --> DB
    DB --> WS
    WS -->|COMPLETE_JSON| UI
```

---

## 📊 The 12-Factor Deterministic Scoring System

Our engine uses a proprietary, 100-point deterministic rubric that eliminates bias and ensures every resume is judged by the same rigorous standard.

| Factor | Weight | How It's Calculated |
|--------|:---:|-------|
| **Internships** | 20 pts | `min(count / 2, 1.0) × 20`. Padding protection catches fakes <20 chars. |
| **Technical Skills** | 20 pts | Base count + Advanced Domain Bonus + SpaCy JD Vector Match (+5 pts). |
| **Projects** | 15 pts | min(count/3, 1.0) × 12 + Adv Tech (+2) + quantified Impact (+3). |
| **CGPA / Academic** | 10 pts | Auto-detects 4.0 vs 10.0 scale, normalizes to percentage brackets. |
| **Achievements** | 10 pts | Quantified wins ("ranked 3rd") earn 1x, Publications earn 2x. |
| **Work Experience** | 5 pts | Years of experience, capped at 5. Includes a -2pt Job-Hopper Penalty. |
| **Extra-Curricular** | 5 pts | Hackathons, clubs, volunteering, and leadership roles. |
| **Degree Quality** | 3 pts | Advanced degrees (PhD/Masters) score 3/3; Bachelors score 2/3. |
| **Online Presence** | 3 pts | 1pt each for verified GitHub, LinkedIn, and Portfolio links. |
| **Languages** | 3 pts | Detection of up to 3 spoken/written languages. |
| **College Tier** | 2 pts | Tier-1 (IIT/NIT/BITS) vs Tier-2 vs Tier-3 bracket analysis. |
| **School Marks** | 2 pts | Percentage brackets for 10th/12th grade scores. |

### 🛠️ Neural Calibration Layers (Dynamic Logic)

1.  **Fresher vs. Experienced Logic**: For senior candidates (2+ years), the 20pt Internship weight dynamically transfers to **Work Experience**, ensuring veterans aren't penalized for old internships.
2.  **Prestige Multiplier**: Automated detection of FAANG/Top-Tier companies (+8% boost) and Tier-1 Universities (+5% boost).
3.  **Skill-Project Consistency**: We cross-reference claimed skills against project descriptions. Highly consistent profiles earn a **+3 point bonus**.
4.  **Completeness Multiplier**: Up to **+16% total boost** for resumes with high data density (links + projects + languages + achievements).

---

## 🏆 TalentScout AI vs. SAH (The Competitive Edge)

| Capability | TalentScout AI | Competitor (SAH) |
|------------|:---:|:---:|
| **Underlying Engine** | **Neural LLM (LPU Powered)** | Pure Regex / String Matching |
| **Concurrency** | **6x Parallel AI Tasking** | Sequential Batch Only |
| **Security Firewall** | **7-Layer Anti-Fraud Engine** | Basic Font Detection Only |
| **Verification** | **Live GitHub API Trust Score** | ❌ None (Assumes Truth) |
| **Extraction** | **Dual-Engine + OCR Fallback** | ❌ No OCR for Scanned PDFs |
| **Interactivity** | **AI Battle Royale Arbitration** | ❌ None |
| **Speed** | **Real-Time WebSocket Streams** | ❌ Batch Table Rendering |
| **JD Match** | **SpaCy Vector Cosine Similarity** | ❌ Basic Keyword Counting |
| **Architecture** | Production Next.js + FastAPI | Basic Streamlit App |

**We Win Because:** While SAH acts as a simple parser, TalentScout is an **AI-powered forensic co-pilot.** We catch prompt injections, verify candidate claims via external APIs, and use high-speed parallel LLMs to generate hireability reports that standard parsers simply cannot produce.

---


## 🚀 Setup & Deployment

TalentScout AI is built for radical simplicity and speed.

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key
- Clerk API Keys

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/shashank-tomar0/RankSense-AI.git
   cd RankSense-AI
   ```

2. **Backend Setup:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev -- -p 3001
   ```

*(Requires `.env` files configured in both roots with your Groq and Clerk keys).*
