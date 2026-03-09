import requests

url = "http://localhost:8000/candidates"
headers = {"X-User-Id": "user_3AG1zqGwjXK10YcVtjKsXUudwVR"}

try:
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        candidates = response.json()
        print(f"Total candidates: {len(candidates)}")
        for c in candidates[:10]:
            print(f"[{c.get('filename')}] Score: {c.get('score')} | Locked: {c.get('is_locked')} | Duplicate: {c.get('is_duplicate')} | Malicious: {c.get('prompt_injection_detected')}")
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"Connection error: {e}")
