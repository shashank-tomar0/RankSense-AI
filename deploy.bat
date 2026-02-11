@echo off
echo Configuring Git...
git config user.email "bot@ranksense.ai"
git config user.name "RankSense Bot"

echo Initializing Repo...
git init

echo Adding Files...
git add .

echo Committing...
git commit -m "Initial commit: RankSense Enterprise Core"

echo Setting Branch...
git branch -M main

echo Adding Remote...
git remote remove origin
git remote add origin https://github.com/shashank-tomar0/RankSense-AI.git

echo Pushing to GitHub...
git push -u origin main

echo Done.
pause
