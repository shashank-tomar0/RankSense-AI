import sqlite3, json
conn = sqlite3.connect('talentscout.db')
c = conn.cursor()
rows = c.execute('SELECT name, data_json FROM candidates').fetchall()
for r in rows:
    name = r[0]
    data = json.loads(r[1])
    print(f"Name: {name}, CGPA: {data.get('cgpa')}")
conn.close()
