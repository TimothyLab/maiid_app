import os

class Settings:
    MODE: str = os.getenv("APP_MODE", "json")  # "db" ou "json"

settings = Settings()