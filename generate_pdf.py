import fitz
import os

def create_pdf(text, output_path):
    doc = fitz.open()
    page = doc.new_page()
    
    # Define margin and starting point
    margin = 50
    p = fitz.Point(margin, margin)
    
    # Split text into lines to avoid overflow
    lines = text.split('\n')
    
    for line in lines:
        if p.y > 750:  # New page if near bottom
            page = doc.new_page()
            p = fitz.Point(margin, margin)
        
        # Insert text (simplified, no markdown rendering)
        page.insert_text(p, line, fontname="helv", fontsize=10)
        p.y += 15  # Line spacing
        
    doc.save(output_path)
    doc.close()

if __name__ == "__main__":
    md_path = r"C:\Users\dell\.gemini\antigravity\brain\37839076-c6ba-4660-9d20-3c7ecf445a2a\hackathon_submission.md"
    pdf_path = r"C:\Users\dell\.gemini\antigravity\brain\37839076-c6ba-4660-9d20-3c7ecf445a2a\hackathon_submission.pdf"
    
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    create_pdf(content, pdf_path)
    print(f"PDF created at: {pdf_path}")
