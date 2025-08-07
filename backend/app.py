from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
api_key = os.getenv("API_KEY")
openai.api_key = api_key

def analyze_content_with_gpt(text):
    prompt = (
    "You are a critical thinking assistant trained in psychology and media literacy.\n"
    "Analyze the following text and identify:\n"
    "- Potential misinformation (false or misleading information)\n"
    "- Any kind of bias (including emotional, political, or persuasive framing)\n"
    "- Any cognitive biases or logical fallacies present (e.g., confirmation bias, framing effect, appeal to authority, slippery slope, etc.)\n"
    "- If a claim lacks a verifiable source\n\n"
    "Be specific. Point out exactly which part of the text shows the issue.\n\n"
    f"Text: {text}\n\n"
    "Respond in this format:\n"
    "Flags: [e.g. 'Confirmation Bias', 'Unverified Claim', 'Framing Effect']\n"
    "Explanation: ...\n"
    "Confidence: High / Medium / Low\n"
)

    
    try:
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-4",  
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=500,
        )
        answer = response.choices[0].message.content.strip()
        return answer
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        raise e

@app.route("/analyze", methods=["POST", "OPTIONS"])  
def analyze():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
            
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided."}), 400

        result = analyze_content_with_gpt(text)
        return jsonify({"result": result})
    except Exception as e:
        print(f"Error: {e}")  
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Server is running"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)