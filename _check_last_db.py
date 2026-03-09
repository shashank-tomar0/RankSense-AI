import sqlite3, json
try:
    conn = sqlite3.connect('talentscout.db')
    c = conn.cursor()
    c.execute('SELECT data_json FROM candidates ORDER BY id DESC LIMIT 1')
    row = c.fetchone()
    if row:
        data = json.loads(row[0])
        print("--- STRUCTURED DATA ---")
        sd = data.get('structured_data', {})
        print(json.dumps(sd, indent=2))
        print("--- RAW TEXT EXCERPT ---")
        print(data.get('raw_text', '')[:1000])
    else:
        print("No candidates found.")
except Exception as e:
    print("Error:", e)
finally:
    if 'conn' in locals():
        conn.close()
