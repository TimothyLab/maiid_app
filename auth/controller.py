#route
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from .service import * 
from database.models import User
from auth.models import UserCreate, UserResponse, UserUpdate

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
    new_user = create_user(db, user.username, user.password, user.nom, user.prenom, user.email)
    
    return {"message": "Utilisateur créé avec succès", "user": new_user}

@router.post("/login/")
def login(user: UserCreate = Body(...), db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.login}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/admin/users", response_model=list[UserResponse])
def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    #print(f"L'utilisateur appartient au groupe : {current_user.groupe.nom_groupe}")
    
    users = db.query(User).all()
    return [UserResponse.from_orm(user) for user in users]

@router.put("/users/{id}", response_model=UserResponse)
def update_user(id: int, user_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"resultat de la route /user/{id}",user_data.dict(exclude_unset=True))
    if current_user.role != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    user = db.query(User).filter(User.id_user == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

    for key, value in user_data.dict(exclude_unset=True).items():
        if key == "role":
            key = "id_groupe"
        if value == "Admin":
            value = 1
        elif value == "Visiteur":    
            value = 2
        setattr(user, key, value)  # Mise à jour des champs fournis uniquement

    db.commit()
    db.refresh(user)
    
    return user

@router.get("/users/me", response_model=UserResponse)  # Réponse formatée avec le modèle User
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    #return UserResponse.from_orm(current_user)
    return UserResponse(
        id_user=1,
        login="Tim",
        nom="t@t.fr",
        prenom="Timothy",
        date_inscription="2025-03-19",
        role="Admin"
    ) # A MODIFIER ! Pour récupérer les données de l'utilisateur connecté moins de faire un seul compte admin et de le renvoyer en dur