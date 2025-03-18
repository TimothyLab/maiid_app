from fastapi import Depends,FastAPI, UploadFile, File,HTTPException,status, Form, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import cv2
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, Mapped, mapped_column, sessionmaker

from pydantic import BaseModel, ConfigDict 
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO 

# Définition du modèle SQLAlchemy
Base = declarative_base()

# Chargement du modèle YOLOv8 pré-entraîné
model = YOLO("weights/best.pt")

# Clés et paramètres pour JWT
SECRET_KEY = "8c562ae07a871379d7525fbd74915447fd9061999dc87526b99b966eec17d5b9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic models pour valider les données
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email = Column(String, index=True)
    full_name = Column(String, index=True)
    disabled = Column(Boolean, default=False)

class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    disabled: bool

class ImageDB(Base):
    __tablename__ = "image"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    url = Column(String)

# Base de données SQLite et session
DATABASE_URL = "sqlite:///./dump-maiid_app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Création des tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Initialisation de FastAPI
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hashing des mots de passe avec passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dépendance pour récupérer la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fonctions pour la gestion des utilisateurs et du mot de passe
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, password: str, email: str, full_name: str):
    hashed_password = hash_password(password)
    db_user = User(username=username, hashed_password=hashed_password, email=email, full_name=full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes pour la gestion des utilisateurs et l'authentification

@app.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérification si l'utilisateur existe déjà
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")

    # Créer l'utilisateur dans la base de données
    new_user = create_user(db, user.username, user.password, user.email, user.full_name)
    
    return {"message": "Utilisateur créé avec succès", "user": new_user}

@app.post("/login/")
def login(user: UserCreate = Body(...), db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


# Token et Authentification

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = get_user(db, username=username)
    except JWTError:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    return user

# Exemple de route sécurisée pour récupérer l'utilisateur actuel
@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Route pour l'analyse d'image
@app.post('/analyse')
async def analyse_image(file: UploadFile = File(...)):
    image_data = await file.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
    results = model(image)

    detections = []
    for result in results:
        print(f"1",result)
        for box in result.boxes:
            print(f"2",box)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            class_name = model.names[class_id]

            detections.append({
                "species": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })

    print(detections)
    return JSONResponse(content={"detections": detections})

# Fonction pour générer un token JWT
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    db_user = get_user(db, form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
         data={"sub": db_user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}





