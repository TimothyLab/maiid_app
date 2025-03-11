from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Groupe(Base):
    __tablename__ = "GROUPE"
    id_groupe = Column(Integer, primary_key=True)
    nom_groupe = Column(String(255), unique=True, nullable=False)

class Utilisateur(Base):
    __tablename__ = "UTILISATEUR"
    id_user = Column(Integer, primary_key=True)
    login = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    nom = Column(String(255), nullable=False)
    prenom = Column(String(255), nullable=False)
    date_inscription = Column(Date, nullable=False)
    group_id = Column(Integer, ForeignKey('GROUPE.id_groupe', ondelete='CASCADE'), unique=True, nullable=False)
    groupe = relationship("Groupe")

class Analyse(Base):
    __tablename__ = "ANALYSE"
    id_analyse = Column(Integer, primary_key=True)
    date_analyse = Column(DateTime, nullable=False)
    algo_config = Column(Text)
    user_feedback = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey('UTILISATEUR.id_user', ondelete='CASCADE'), unique=True, nullable=False)
    utilisateur = relationship("Utilisateur")

class BoundingBox(Base):
    __tablename__ = "BOUNDING_BOX"
    id_bounding_box = Column(Integer, primary_key=True)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    class_result = Column(String(255), nullable=False)
    analyse_id = Column(Integer, ForeignKey('ANALYSE.id_analyse', ondelete='CASCADE'), unique=True, nullable=False)
    analyse = relationship("Analyse")
