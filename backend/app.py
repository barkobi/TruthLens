import os
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to call API

# Set your OpenAI API key (preferably from environment variable)
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_content_with_gpt(text):
    prompt = (
        "Analyze the following text for potential misinformation, bias, or lack of verifiable sources. "
        "If there are issues, flag them and explain why. Be specific, and provide a confidence rating (High/Medium/Low):\n\n"
        f"Text: {text}\n\n"
        "Respond in this format:\n"
        "Flags: [list of flags, e.g. 'Potential Bias', 'Unverified Claim']\n"
        "Explanation: ...\n"
        "Confidence: ...\n"
    )
    response = openai.ChatCompletion.create(
        model="gpt-4o",  # or gpt-3.5-turbo if preferred
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=500,
    )
    answer = response.choices[0].message.content.strip()
    return answer

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided."}), 400
    try:
        result = analyze_content_with_gpt(text)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
