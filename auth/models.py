#class
from pydantic import BaseModel,root_validator
from typing import Optional
from datetime import date, datetime

# Pydantic models pour valider les données
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class UserCreate(BaseModel):
    username: str
    password: str
    nom : str
    prenom : str
    email: str

class UserResponse(BaseModel):
    id_user: int
    login: str
    nom: str
    prenom: str
    date_inscription: date
    role: Optional[str] = "Visiteur"

    @classmethod
    def from_orm(cls, user):
        return cls(
            id_user=user.id_user,
            login=user.login,
            nom=user.nom,
            prenom=user.prenom,
            date_inscription=user.date_inscription,
            role='Admin' if user.id_groupe == 1 else 'Visiteur' if user.id_groupe == 2 else 'Utilisateur'
        )

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    login: Optional[str] = None
    role: Optional[str] = None