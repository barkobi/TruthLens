from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import os

app = Flask(__name__)
# Fix CORS configuration - allow all origins for development
CORS(app)

# SECURITY WARNING: Never hardcode API keys in production!
# Use environment variable instead: os.getenv('OPENAI_API_KEY')
openai.api_key = "you-api-key"

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
    
    try:
        # Updated to use the new OpenAI client format
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-4",  # Changed from gpt-4o to gpt-4
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=500,
        )
        answer = response.choices[0].message.content.strip()
        return answer
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        raise e

@app.route("/analyze", methods=["POST", "OPTIONS"])  # Added OPTIONS for CORS preflight
def analyze():
    # Handle CORS preflight request
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
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Server is running"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)