# TruthLens – AI-Powered Misinformation Detection Tool

TruthLens is a web app that uses GPT to detect potential misinformation or bias in social media posts, headlines, or short-form content.


## Link to youtube


## Features

- Analyze any sentence or tweet for bias/misinformation
- GPT-based analysis with explanation + confidence rating
- Easy-to-use React frontend
- Flask backend with OpenAI integration

## Tech Stack

- Frontend: React.js
- Backend: Flask (Python)
- AI Model: OpenAI GPT-4o
- CORS configured for local development

## How to Run Locally

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors openai
export OPENAI_API_KEY=your_openai_key_here
python app.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App will be available at: [http://localhost:3000](http://localhost:3000)

## Example Prompt

> "All politicians are liars and can never be trusted."

**Output:**

```
Flags: [Potential Bias]
Explanation: The statement is a sweeping generalization and exhibits strong bias against all politicians.
Confidence: Medium
```

## Known Limitations

- GPT may hallucinate or give inconsistent answers
- No source citation
- Accuracy may vary depending on phrasing

## Future Improvements

- Add fact-checking APIs (e.g., Google Fact Check)
- Better UI for flagged content
- User feedback on analysis accuracy
