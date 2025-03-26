import os
import numpy as np
from fastapi import APIRouter
from fastapi import File, UploadFile, Depends
from fastapi.responses import JSONResponse
from database.models import User
from database.service import create_analyse, create_bounding_box, create_image,get_db
from auth.service import get_current_user 
from .service import calculate_md5
from sqlalchemy.orm import Session
import cv2
from .core import model

router = APIRouter(
    prefix="/analyse",
    tags=["analyse"]
)

@router.post('/analyse')
async def analyse_image(file: UploadFile = File(...),current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    # Lire l'image
    image_data = await file.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
    
    
    # Analyser l'image avec YOLOv8
    results = model(image)

    # Liste pour stocker les détections
    detections = []

    # Parcourir les résultats de la détection
    for result in results:
        #print(f"1",result)
        for box in result.boxes:
            #print(f"2",box)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            class_name = model.names[class_id]

            detections.append({
                "species": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })

    # Enregistrement de l'image 

    UPLOAD_DIR = "uploaded_images"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    md5_hash = calculate_md5(image_data)

    # Déterminer le chemin du fichier
    file_extension = file.filename.split(".")[-1]
    image_path = os.path.join(UPLOAD_DIR, f"{md5_hash}.{file_extension}")
    # Vérifier si l'image existe déjà
    if not os.path.exists(image_path):
        # Écrire l'image sur le disque
        with open(image_path, "wb") as f:
            f.write(image_data)

    #maj bdd
    image = create_image(db, image_path=image_path, md5_hash=md5_hash)
  
    # Enregistrer l'analyse dans la base de données
    analyse = create_analyse(db, id_user=current_user.id_user, id_image=image.id_image)

    
    # Enregistrer chaque bounding box dans la base de données
    for detection in detections:
        create_bounding_box(
            db,
            x1=detection["bounding_box"][0],
            y1=detection["bounding_box"][1],
            x2=detection["bounding_box"][2],
            y2=detection["bounding_box"][3],
            class_result=detection["species"],
            id_image=image.id_image
        )
    #print(analyse)
    #print(detections)

    return JSONResponse(content={"detections": detections})
