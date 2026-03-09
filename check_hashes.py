import sqlite3
import json

DB_NAME = "talentscout.db"

def check_recent_hashes():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, filename, file_hash, user_id, created_at FROM candidates ORDER BY id DESC LIMIT 5")
    rows = c.fetchall()
    
    print(f"{'ID':<5} | {'Filename':<30} | {'Hash (prefix)':<15} | {'User ID':<15} | {'Created At'}")
    print("-" * 80)
    for row in rows:
        print(f"{row[0]:<5} | {row[1]:<30} | {row[2][:12]:<15} | {row[3]:<15} | {row[4]}")
    
    conn.close()

if __name__ == "__main__":
    check_recent_hashes()
