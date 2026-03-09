import sqlite3

DB_NAME = "talentscout.db"

def check_user_ids():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT DISTINCT user_id FROM candidates")
    rows = c.fetchall()
    
    print("Distinct User IDs in candidates table:")
    for row in rows:
        print(f" - {row[0]}")
    
    c.execute("SELECT user_id, COUNT(*) FROM candidates GROUP BY user_id")
    rows = c.fetchall()
    print("\nCounts per User ID:")
    for row in rows:
        print(f" - {row[0]}: {row[1]}")
    
    conn.close()

if __name__ == "__main__":
    check_user_ids()
