#fonction
from datetime import datetime, timedelta
from jose import jwt, JWTError
from .models import UserResponse
from database.models import User,Groupe
from database.service import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer



# Clés et paramètres pour JWT
SECRET_KEY = "8c562ae07a871379d7525fbd74915447fd9061999dc87526b99b966eec17d5b9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, username: str):
    return db.query(User).filter(User.login == username).first()

def create_user(db: Session,login: str, password: str,nom: str, prenom: str, ):
    hashed_password = hash_password(password)
    db_user = User(login=login, password=hashed_password,nom=nom, prenom=prenom, date_inscription=datetime.now())
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


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        #print("Token reçu:", token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #print("Payload décodé:", payload)
        nom: str = payload.get("sub")
        
        if nom is None:
            raise credentials_exception
        
        user = get_user(db, nom)
        groupe = db.query(Groupe).join(User, User.id_groupe == Groupe.id_groupe).filter(User.login == nom).first()
        user.role = groupe.nom_groupe
        print("Utilisateur trouvé:", user.role) 
    
    except JWTError as e :
        #print("Erreur JWT:", e)
        raise credentials_exception
    
    if user is None:
        #print("Utilisateur non trouvé dans la base de données")
        raise credentials_exception

    user = UserResponse.from_orm(user)

    return user