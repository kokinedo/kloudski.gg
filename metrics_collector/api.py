from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/metrics', methods=['GET'])
def get_metrics():
    data_file = Path("data/metrics.json")
    if data_file.exists():
        with open(data_file, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({"error": "No data available"})

if __name__ == '__main__':
    app.run(port=5000) 