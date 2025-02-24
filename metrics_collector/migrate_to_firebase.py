import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from pathlib import Path
import copy

def sanitize_data(data):
    """Recursively sanitize data to ensure it's Firestore-compatible"""
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items() if k is not None}
    elif isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif data is None:
        return ""  # Convert None to empty string
    else:
        return data

def migrate_data():
    # Initialize Firebase
    cred = credentials.Certificate("firebase-key.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    # Load existing data
    data_file = Path("data/metrics.json")
    if data_file.exists():
        with open(data_file, 'r') as f:
            metrics = json.load(f)
        
        # Create a deep copy to modify
        metrics_to_upload = copy.deepcopy(metrics)
        
        # Handle hourly_data separately
        hourly_data = metrics_to_upload.pop('hourly_data', [])
        
        # Sanitize main metrics
        metrics_to_upload = sanitize_data(metrics_to_upload)
        
        # Upload main metrics document
        print("Uploading main metrics...")
        db.collection('metrics').document('current').set(metrics_to_upload)
        
        # Upload hourly data as separate documents
        print(f"Uploading {len(hourly_data)} hourly data entries...")
        
        for i, hour_data in enumerate(hourly_data):
            try:
                # Create a document ID based on timestamp or index
                doc_id = f"hour_{i}"
                if 'timestamp' in hour_data:
                    # Clean up timestamp to be a valid document ID
                    doc_id = hour_data['timestamp'].replace(':', '-').replace('.', '-')
                
                # Sanitize the hourly data
                sanitized_hour_data = sanitize_data(hour_data)
                
                # Upload as individual document
                hourly_ref = db.collection('metrics').document('current').collection('hourly_data')
                hourly_ref.document(doc_id).set(sanitized_hour_data)
                
                print(f"Uploaded hourly data {i+1}/{len(hourly_data)}")
            except Exception as e:
                print(f"Error uploading hourly data {i}: {e}")
                print(f"Problematic data: {hour_data}")
        
        print("Data successfully migrated to Firebase!")
    else:
        print("No existing data found.")

if __name__ == "__main__":
    migrate_data() 