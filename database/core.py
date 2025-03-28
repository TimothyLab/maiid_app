
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Base de données MariaDB et session
DATABASE_URL = "mariadb+mariadbconnector://admin:admin@localhost:3306/maiid_app" #parser par fichier de config yaml

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
