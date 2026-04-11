from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get("/hello")
def hello():
    return {"message": "Bienvenue sur notre API !"}

@app.get("/status")
def status():
    return {"datetime": datetime.now().isoformat()}