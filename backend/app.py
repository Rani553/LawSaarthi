"""
Lawsarthi Flask API - Main Application (UPDATED)
This connects your Python chatbot to the Lovable frontend
"""

from flask import Flask, request, Response
from flask_cors import CORS
from chatbot_query import query_articles
import json

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages from frontend"""
    try:
        data = request.json
        user_message = data.get('message', '').strip()

        if not user_message:
            response_text = "Please enter a valid question."
        else:
            response_text = query_articles(user_message)

        # ✅ IMPORTANT FIX: Proper Unicode output
        return Response(
            json.dumps({"response": response_text}, ensure_ascii=False),
            mimetype="application/json"
        )

    except Exception as e:
        print(f"Error: {e}")
        return Response(
            json.dumps({"response": "Sorry, an error occurred. Please try again."}, ensure_ascii=False),
            mimetype="application/json",
            status=500
        )

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return Response(
        json.dumps({"status": "healthy", "service": "Lawsarthi API"}, ensure_ascii=False),
        mimetype="application/json"
    )

if __name__ == "__main__":
    print("🚀 Lawsarthi API starting...")
    print("📡 Frontend can connect to: http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
