from fastapi import FastAPI, HTTPException
from datetime import datetime
from google.cloud import storage
import os
import json
from dotenv import load_dotenv
import vertexai
from vertexai.generative_models import GenerativeModel

load_dotenv()

app = FastAPI()

BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
FILE_PATH = os.getenv("GCS_FILE_PATH")

GCP_PROJECT = os.getenv("GCP_PROJECT", "esme-projet")
GCP_REGION = os.getenv("GCP_REGION", "us-central1")

def get_gcs_client():
    return storage.Client(project="esme-projet")

@app.get("/hello")
def hello():
    return {"message": "Bienvenue sur notre API !"}

@app.get("/status")
def status():
    return {"datetime": datetime.now().isoformat()}

@app.get("/data")
def get_data():
    client = get_gcs_client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(FILE_PATH)
    content = blob.download_as_text()
    return json.loads(content)

@app.post("/data")
def post_data(entry: dict):
    client = get_gcs_client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(FILE_PATH)
    content = json.loads(blob.download_as_text())
    content["entries"].append(entry)
    blob.upload_from_string(json.dumps(content), content_type="application/json")
    return {"message": "Entrée ajoutée", "entry": entry}

@app.get("/poem")
def get_poem():
    try:
        vertexai.init(project=GCP_PROJECT, location=GCP_REGION)
        model = GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            "Écris un poème court et poétique en français sur la technologie et le cloud computing."
        )
        return {"poem": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur Vertex AI : {str(e)}")