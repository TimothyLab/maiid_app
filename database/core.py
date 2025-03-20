
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

# Base de données MariaDB et session
DATABASE_URL = "mariadb+mariadbconnector://admin:admin@localhost:3306/maiid_app"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
