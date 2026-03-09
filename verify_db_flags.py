import sqlite3
import json

conn = sqlite3.connect('c:/Users/dell/Desktop/xnords/talentscout.db')
c = conn.cursor()

c = conn.cursor()

print("--- ALL CANDIDATES ---")
c.execute("SELECT id, filename, score, is_locked, data_json FROM candidates ORDER BY id DESC LIMIT 20")
for row in c.fetchall():
    id, filename, score, is_locked, data = row
    try:
        parsed = json.loads(data)
        is_duplicate = parsed.get("is_duplicate", False)
        is_malicious = parsed.get("is_malicious", False)
        print(f"[{id}] {filename} | Score: {score} | Locked: {is_locked} | Dup: {is_duplicate} | Mal: {is_malicious}")
    except:
        print(f"[{id}] {filename} | Score: {score} | Locked: {is_locked} | ERROR PARSING JSON")

conn.close()
