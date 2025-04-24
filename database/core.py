
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Base de données MariaDB et session
#DATABASE_URL = "mariadb+mariadbconnector://admin:admin@localhost:3306/maiid_app" 
DATABASE_URL = "mysql+mariadbconnector://admin:mdpadmin@localhost:3306/maiid_app" # mysql au lieu de mariadb pour Tim

engine = create_engine(DATABASE_URL)
print("connection database ok")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


