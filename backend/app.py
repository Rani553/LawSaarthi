"""
Lawsarthi Flask API (Fixed for Render deployment)
"""

import os
import json
from flask import Flask, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------------------------
# SAFE CHAT ENDPOINT
# -------------------------
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get('message') or '').strip()

        if not user_message:
            response_text = "Please enter a valid question."
        else:
            # TEMP SAFE RESPONSE (avoid crash)
            response_text = f"You asked: {user_message}"

        return Response(
            json.dumps({"response": response_text}, ensure_ascii=False),
            mimetype="application/json"
        )

    except Exception as e:
        print("Error in /chat:", str(e))
        return Response(
            json.dumps(
                {"response": "Server error. Please try again."},
                ensure_ascii=False
            ),
            mimetype="application/json",
            status=500
        )


# -------------------------
# HEALTH CHECK
# -------------------------
@app.route('/health', methods=['GET'])
def health():
    return Response(
        json.dumps(
            {"status": "healthy", "service": "Lawsarthi API"},
            ensure_ascii=False
        ),
        mimetype="application/json"
    )


# -------------------------
# RENDER ENTRY POINT
# -------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
