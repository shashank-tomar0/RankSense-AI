import sqlite3
import json

DB_NAME = "talentscout.db"

def check_gpas():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    rows = c.execute("SELECT name, data_json FROM candidates").fetchall()
    for name, data_json in rows:
        data = json.loads(data_json)
        print(f"Candidate: {name}")
        print(f"  Total Score: {data.get('score')}")
        # Check various places where GPA might be stored
        print(f"  CGPA (Flat): {data.get('cgpa')}")
        # Check structured_data
        structured = data.get('structured_data', {})
        if structured:
            edu = structured.get('education', {})
            print(f"  CGPA (Structured): {edu.get('cgpa')}")
            print(f"  School Marks: {edu.get('school_marks')}")
        print("-" * 20)
    conn.close()

if __name__ == "__main__":
    check_gpas()
