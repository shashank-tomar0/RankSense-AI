# RankSense.AI // ENTERPRISE_CORE

**AI-Powered Resume Scoring & Intelligence System**

![RankSense Dashboard](https://via.placeholder.com/800x400.png?text=RankSense+Enterprise+Dashboard)

RankSense is an advanced resume parsing and ranking engine designed for high-volume recruitment. It uses Natural Language Processing (NLP) to extract extracting skills, internships, and projects, and compares them against Job Descriptions (JDs) to provide a tactical "Gap Analysis".

## 🚀 Key Features

-   **Multi-Format Ingestion**: Supports `.pdf` and `.docx` resumes.
-   **NLP Gap Analysis**: Uses **Spacy** to identify matched vs. missing keywords from Job Descriptions.
-   **Weighted Scoring**: 12-factor algorithm (Internships, Projects, Skills, CGPA, etc.).
-   **Enterprise Dashboard**: "Cyberpunk/Enterprise" aesthetic with real-time WebSocket logs.
-   **Persistence**: SQLite database stores all candidate history.
-   **Detail Inspector**: Hover over candidates to see extracted snippets and gap analysis.
-   **CSV Export**: One-click export of ranked candidates.

## 🛠️ Installation

**Prerequisites**: Python 3.9+

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/ranksense-ai.git
    cd ranksense-ai
    ```

2.  **Install Dependencies**:
    Double-click `install_reqs.bat` OR run:
    ```bash
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    ```

## ⚡ Usage

1.  **Start the System**:
    Double-click `start_ranksense.bat`.
    
    This launches:
    -   Backend API: `http://localhost:8000`
    -   Frontend UI: `http://localhost:3000`

2.  **Upload Resumes**:
    -   Open the dashboard.
    -   (Optional) Paste a Job Description in the "Target Profile" box.
    -   Drag & Drop PDF/DOCX files.

3.  **Analyze**:
    -   Watch real-time logs in the "System Terminal".
    -   Click on any candidate to view the **Gap Analysis**.

## 🏗️ Architecture

-   **Backend**: FastAPI, Uvicorn, SQLite
-   **Data Processing**: pdfplumber, python-docx, Spacy NLP, Regex
-   **Frontend**: HTML5, Vanilla JS, Tailwind CSS via CDN
-   **Protocol**: WebSockets for real-time telemetry

## 📜 License

MIT License. Built by **Team Xnords**.
