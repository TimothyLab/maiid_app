#route
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from auth.service import get_user,verify_password,ACCESS_TOKEN_EXPIRE_MINUTES,create_access_token
from auth.models import Token
from database.core import SessionLocal
 


router = APIRouter(
    prefix="/db",
    tags=["db"]
)

# Fonction pour générer un token JWT
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        with SessionLocal() as db:
            db_user = get_user(db, form_data.username)
            if not db_user or not verify_password(form_data.password, db_user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, 
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"}
                )
            
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": db_user.nom}, expires_delta=access_token_expires
            )
            return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        print("ERROR")
        print(f"[DB ERROR] {e}")
        raise