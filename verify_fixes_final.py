import sqlite3
import hashlib
import json
import os

DB_NAME = "talentscout.db"

def verify_db_duplicates():
    print("--- Verifying Database Duplicate Detection ---")
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Check if we have any duplicates in the DB
    c.execute("SELECT id, filename, is_locked, data_json FROM candidates")
    rows = c.fetchall()
    
    dup_count = 0
    for row in rows:
        data = json.loads(row[3])
        if data.get("is_duplicate"):
            print(f"PASS: Found duplicate in DB: {row[1]} (ID: {row[0]})")
            dup_count += 1
            
    if dup_count == 0:
        print("INFO: No duplicates found in DB currently. You should upload a duplicate to test.")
    else:
        print(f"SUCCESS: {dup_count} duplicates verified in DB state.")
    
    conn.close()

def verify_ocr_fix_file_existence():
    print("\n--- Verifying OCR File Scoping ---")
    # Check if perform_ocr_threaded is at module level in main.py
    with open("main.py", "r", encoding="utf-8") as f:
        content = f.read()
        if "def perform_ocr_threaded" in content and "async def handle_locked_pdf" in content:
            # Check if it's outside process_resume_task
            parts = content.split("async def process_resume_task")
            if "def perform_ocr_threaded" in parts[0]:
                print("SUCCESS: perform_ocr_threaded is at module level above process_resume_task.")
            else:
                print("FAIL: perform_ocr_threaded is still inside or below process_resume_task.")
        else:
            print("FAIL: Could not find perform_ocr_threaded.")

if __name__ == "__main__":
    verify_db_duplicates()
    verify_ocr_fix_file_existence()
