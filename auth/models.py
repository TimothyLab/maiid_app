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

    class Config:
        orm_mode = True

"""
    class Config:
        orm_mode = True
        #from_attributes = True
        #arbitrary_types_allowed = True

    @root_validator(pre=True)
    def convert_date_inscription(cls, values):
        # Convertir le champ date_inscription en chaîne de caractères
        if 'date_inscription' in values and isinstance(values['date_inscription'], datetime):
            values['date_inscription'] = values['date_inscription'].strftime('%Y-%m-%d')  # format de votre choix
        return values
"""