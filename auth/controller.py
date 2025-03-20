#route
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from .service import * 
from database.models import User
from auth.models import UserCreate

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Routes pour la gestion des utilisateurs et l'authentification

@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérification si l'utilisateur existe déjà
    db_user = db.query(User).filter(User.nom == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")

    # Créer l'utilisateur dans la base de données
    new_user = create_user(db, user.username, user.password, user.email, user.full_name)
    
    return {"message": "Utilisateur créé avec succès", "user": new_user}

@router.post("/login/")
def login(user: UserCreate = Body(...), db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.login}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
