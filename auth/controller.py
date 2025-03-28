#route
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from .service import * 
from database.models import User
from auth.models import UserCreate, UserResponse, UserUpdate
from typing import List

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Routes pour la gestion des utilisateurs et l'authentification
@router.get("/test")
def test_route():
    return {"message": "Je suis une route de test"}


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
def login(user: UserCreate = Body(...)):
    db_user = get_user_from_json(user.username)
    #print(db_user)
    #db_user = get_user(db, user.username)
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user["login"]}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}


# @router.get("/admin/users", response_model=list[UserResponse])
# def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     if current_user.role != "Admin":
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
#     #print(f"L'utilisateur appartient au groupe : {current_user.groupe.nom_groupe}")
    
#     users = db.query(User).all()
#     return [UserResponse.from_orm(user) for user in users]

@router.get("/admin/users", response_model=List[UserResponse])
def get_users(current_user: dict = Depends(get_current_user)):
    # Vérification du rôle (Admin = id_groupe 1)
    if current_user.get("id_groupe") != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé - Admin requis"
        )
    
    # Récupération des utilisateurs depuis JSON
    users_data = JSON_DATA["UTILISATEUR"]
    
    # Conversion en UserResponse
    users = []
    for user_data in users_data:
        # Détermination du nom du rôle
        role_name = None
        for group in JSON_DATA["GROUPE"]:
            if group["id_groupe"] == user_data["id_groupe"]:
                role_name = group["nom_groupe"].strip("'")  # Enlève les apostrophes
                break
        
        users.append(UserResponse(
            id_user=user_data["id_user"],
            login=user_data["login"],
            nom=user_data["nom"],
            prenom=user_data["prenom"],
            date_inscription=datetime.strptime(user_data["date_inscription"], "%Y-%m-%d").date(),
            role=role_name
        ))
    
    return users

@router.put("/users/{id}", response_model=UserResponse)
def update_user(
    id: int, 
    user_data: UserUpdate, 
    current_user: dict = Depends(get_current_user)
):
    # Vérification que l'utilisateur est admin (id_groupe = 1)
    if current_user.get("id_groupe") != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé - Admin requis"
        )

    # Recherche de l'utilisateur à modifier dans les données JSON
    user_to_update = None
    for user in JSON_DATA["UTILISATEUR"]:
        if user["id_user"] == id:
            user_to_update = user
            break

    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Conversion rôle -> id_groupe
    role_mapping = {
        "Admin": 1,
        "Utilisateur": 2,
        "Visiteur": 3
    }

    # Application des modifications
    update_data = user_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "role":
            user_to_update["id_groupe"] = role_mapping.get(value, 2)
        else:
            user_to_update[key] = value

    # Retourne l'utilisateur modifié (format UserResponse)
    return UserResponse(
        id_user=user_to_update["id_user"],
        login=user_to_update["login"],
        nom=user_to_update["nom"],
        prenom=user_to_update["prenom"],
        date_inscription=datetime.strptime(
            user_to_update["date_inscription"], 
            "%Y-%m-%d"
        ).date(),
        role=next(
            (g["nom_groupe"].strip("'") for g in JSON_DATA["GROUPE"] 
            if g["id_groupe"] == user_to_update["id_groupe"]),
            "Visiteur"
        )
    )

@router.put("/users/{id}", response_model=UserResponse)
def update_user(
    id: int, 
    user_data: UserUpdate, 
    current_user: dict = Depends(get_current_user)
):
    # Vérification que l'utilisateur est admin (id_groupe = 1)
    if current_user.get("id_groupe") != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé - Admin requis"
        )

    # Recherche de l'utilisateur à modifier dans les données JSON
    user_to_update = None
    for user in JSON_DATA["UTILISATEUR"]:
        if user["id_user"] == id:
            user_to_update = user
            break

    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Conversion rôle -> id_groupe
    role_mapping = {
        "Admin": 1,
        "Utilisateur": 2,
        "Visiteur": 3
    }

    # Application des modifications
    update_data = user_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "role":
            user_to_update["id_groupe"] = role_mapping.get(value, 2)
        else:
            user_to_update[key] = value

    # Retourne l'utilisateur modifié (format UserResponse)
    return UserResponse(
        id_user=user_to_update["id_user"],
        login=user_to_update["login"],
        nom=user_to_update["nom"],
        prenom=user_to_update["prenom"],
        date_inscription=datetime.strptime(
            user_to_update["date_inscription"], 
            "%Y-%m-%d"
        ).date(),
        role=next(
            (g["nom_groupe"].strip("'") for g in JSON_DATA["GROUPE"] 
            if g["id_groupe"] == user_to_update["id_groupe"]),
            "Visiteur"
        )
    )


# @router.get("/users/me", response_model=UserResponse)  # Réponse formatée avec le modèle User
# async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
#     #return UserResponse.from_orm(current_user)
#     return UserResponse(
#         id_user=1,
#         login="Tim",
#         nom="t@t.fr",
#         prenom="Timothy",
#         date_inscription="2025-03-19",
#         role="Admin"
#     ) # A MODIFIER ! Pour récupérer les données de l'utilisateur connecté moins de faire un seul compte admin et de le renvoyer en dur