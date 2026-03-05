from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "OSS Dev Analytics backend running"}

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500)