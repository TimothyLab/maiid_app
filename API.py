from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO  # Bibliothèque pour YOLOv8

# Initialisation de l'application Flask
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Autoriser les requêtes venant du frontend
origins = [
    "http://localhost:3000",  # URL du frontend en développement
    "https://127.0.0.1:5000"    # URL du frontend en production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise ces origines
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
) # Activation de CORS pour permettre les requêtes depuis le frontend

# Chargement du modèle YOLOv8 pré-entraîné
model = YOLO("weights/best.pt")  # Remplace par le chemin de ton modèle

# Endpoint pour l'analyse d'image
@app.post('/')
async def analyze_image(file: UploadFile = File(...)):
    # Vérifie si une image a été envoyée

    # Récupère l'image envoyée par le frontend
    image_data = await file.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

    # Analyse avec YOLOv8
    results = model(image)

    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            class_name = model.names[class_id]

            detections.append({
                "species": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })

    return JSONResponse(content={"detections": detections})


# Point d'entrée pour exécuter l'API
import uvicorn
if __name__ == "__main__":
    uvicorn.run("API:app", host="127.0.0.1", port=5000, reload=True)