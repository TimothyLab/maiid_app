from database import * 
from auth import *
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api import register_routes
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


# Initialisation de FastAPI
app = FastAPI()


# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

""" Only uncomment below to create new tables, 
otherwise the tests will fail if not connected
"""

register_routes(app)
app.mount("/", StaticFiles(directory="build",html=True), name="build")




