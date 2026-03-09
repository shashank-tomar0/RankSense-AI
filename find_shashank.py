import sqlite3
import json

DB_NAME = "talentscout.db"

def find_shashank():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, filename, user_id, file_hash, data_json FROM candidates WHERE filename LIKE '%shashank%' ORDER BY id DESC LIMIT 5")
    rows = c.fetchall()
    
    print(f"{'ID':<5} | {'Filename':<30} | {'User ID':<20} | {'Hash (prefix)':<15}")
    print("-" * 80)
    for row in rows:
        data = json.loads(row[4])
        # Check if the data_json itself has anything useful
        print(f"{row[0]:<5} | {row[1]:<30} | {row[2]:<20} | {row[3][:12]:<15}")
    
    conn.close()

if __name__ == "__main__":
    find_shashank()
