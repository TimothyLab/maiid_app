from fastapi import FastAPI
from analyse.controller import router as analyse_router
from auth.controller import router as auth_router
#from database.controller import router as database_router


def register_routes(app: FastAPI):
    app.include_router(analyse_router)
    app.include_router(auth_router)
    #app.include_router(database_router)
