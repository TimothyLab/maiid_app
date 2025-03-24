#fonction
from .core import SessionLocal
from datetime import datetime
from .models import Analyse, BoundingBox, Image
from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_analyse(db: Session, id_user: int, id_image: int):
    """
    Crée une nouvelle entrée dans la table ANALYSE.
    """
    analyse = Analyse(
        date_analyse=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        id_user=id_user,
        id_image=id_image
    )
    
    db.add(analyse)
    db.commit()
    db.refresh(analyse)
    return analyse

def create_bounding_box(db: Session, x1: int, y1: int, x2: int, y2: int, class_result: str, id_image: int): #id_analyse: int,
    """
    Crée une nouvelle entrée dans la table BoundingBox.
    """
    bounding_box = BoundingBox(
        x1=x1,
        y1=y1,
        x2=x2,
        y2=y2,
        class_result=class_result,
        #id_analyse=id_analyse,
        id_image=id_image
    )
    db.add(bounding_box)
    db.commit()
    db.refresh(bounding_box)
    return bounding_box

def create_image(db: Session, image_path: str, md5_hash: str):
    """
    Crée une nouvelle entrée dans la table IMAGE.
    """

    existing_image = db.query(Image).filter(Image.md5_hash == md5_hash).first()

    if existing_image:
        return existing_image  # Retourner l'image existante pour éviter les doublons

    image = Image(
        md5_hash=md5_hash,
        image_path=image_path,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image