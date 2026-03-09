import socket
import time
import requests
import json
import os

url = "http://localhost:8000/upload"
user_id = "test_user_locked_dup"

# Test 1: Duplicate logic
dup_file = b"This is a test resume content for duplicate checking. It has some reasonable length so it doesn't get skipped." * 10
files1 = {'file': ('dup_test.pdf', dup_file, 'application/pdf')}
data1 = {'user_id': user_id, 'use_cache': 'false'}

print("=> Uploading first time...")
res1 = requests.post(url, files=files1, data=data1)
print(res1.json())
time.sleep(2)

print("=> Uploading EXACT SAME FILE second time (should be flagged as duplicate)...")
files2 = {'file': ('dup_test_2.pdf', dup_file, 'application/pdf')}
data2 = {'user_id': user_id, 'use_cache': 'false'}
res2 = requests.post(url, files=files2, data=data2)
print(res2.json())
time.sleep(2)

# Check DB
import sqlite3
conn = sqlite3.connect('talentscout.db')
c = conn.cursor()
print("\n--- DB CHECK ---")
for row in c.execute("SELECT filename, score, is_locked, data_json FROM candidates WHERE user_id=? ORDER BY id DESC LIMIT 5", (user_id,)):
    fname, score, locked, d_json = row
    parsed = json.loads(d_json)
    print(f"{fname} | Score: {score} | Locked: {locked} | is_dup: {parsed.get('is_duplicate')} | is_mal: {parsed.get('is_malicious')}")
conn.close()
