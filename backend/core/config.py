from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    celeste_api_key: str = ""  # Placeholder for Celeste API key
    database_url: str = "sqlite:///./satellites.db"  # Placeholder for DB
    supabase_url: str = ""  # Placeholder for Supabase URL
    supabase_api_key: str = ""  # Placeholder for Supabase API key

    class Config:
        env_file = ".env"

settings = Settings()
