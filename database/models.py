#class
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey, Text, TIMESTAMP

# Définition du modèle SQLAlchemy
Base = declarative_base()

class User(Base):
    __tablename__ = "UTILISATEUR"
    __table_args__ = {'extend_existing': True}

    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, nullable=False)
    date_inscription = Column(Date, nullable=False)
    id_groupe = Column(Integer, ForeignKey("GROUPE.id_groupe"), nullable=True)

class Analyse(Base):
    __tablename__ = "ANALYSE"
    __table_args__ = {'extend_existing': True}

    id_analyse = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date_analyse = Column(String(255), nullable=False)
    algo_config = Column(String(255))
    user_feedback = Column(String(255))
    created_at = Column(String(255), nullable=False)
    id_user = Column(Integer, ForeignKey("UTILISATEUR.id_user"), nullable=False)
    id_image = Column(Integer, ForeignKey("IMAGE.id_image"), nullable=False)

class BoundingBox(Base):
    __tablename__ = "BOUNDING_BOX"
    __table_args__ = {'extend_existing': True}

    id_bounding_box = Column(Integer, primary_key=True, index=True, autoincrement=True)
    x1 = Column(Integer, nullable=False)
    y1 = Column(Integer, nullable=False)
    x2 = Column(Integer, nullable=False)
    y2 = Column(Integer, nullable=False)
    class_result = Column(String(255), nullable=False)
    #id_analyse = Column(Integer, ForeignKey("ANALYSE.id_analyse"), nullable=False)
    id_image = Column(Integer, ForeignKey("IMAGE.id_image"), nullable=False)

class Groupe(Base):
    __tablename__ = "GROUPE"
    __table_args__ = {'extend_existing': True}

    id_groupe = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom_groupe = Column(String, unique=True, nullable=False)

class Image(Base):
    __tablename__ = "IMAGE"
    __table_args__ = {'extend_existing': True}

    id_image = Column(Integer, primary_key=True, index=True, autoincrement=True)
    md5_hash = Column(String, unique=True, nullable=False)
    image_path = Column(String, nullable=False)