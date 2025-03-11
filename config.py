from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Connexion à la base SQLite
DATABASE_URL = "dump-maiid_app.sql"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
