from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes cross-origin (CORS)
import cv2
import numpy as np
from ultralytics import YOLO  # Bibliothèque pour YOLOv8

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)  # Activation de CORS pour permettre les requêtes depuis le frontend

# Chargement du modèle YOLOv8 pré-entraîné
model = YOLO("weights/best.pt")  # Remplace par le chemin de ton modèle

# Endpoint pour l'analyse d'image
@app.route('/', methods=['POST'])
def analyze_image():
    # Vérifie si une image a été envoyée
    if 'file' not in request.files:
        return jsonify({"error": "Aucune image trouvée dans la requête"}), 400

    # Récupère l'image envoyée par le frontend
    file = request.files['file']
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR) 

    # Analyse de l'image avec YOLOv8
    results = model(image)  # YOLOv8 renvoie les résultats de la détection

    # Formatage des résultats pour le frontend
    detections = []
    for result in results:
        for box in result.boxes:
            # Récupère les coordonnées de la bounding box
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            # Récupère la probabilité et la classe détectée
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            class_name = model.names[class_id]  # Nom de la classe (espèce de moustique)

            # Ajoute la détection à la liste
            detections.append({
                "species": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })

    # Renvoie les résultats au frontend
    return jsonify({"detections": detections})


# Point d'entrée pour exécuter l'API
if __name__ == '__main__':
    app.run(port=5000)  # Lance l'API sur le port 5000