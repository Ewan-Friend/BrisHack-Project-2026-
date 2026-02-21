import os
from supabase import create_client, Client
from models.satellite import SatelliteData
from core.config import settings

# Initialize Supabase client
supabase_url = settings.supabase_url
supabase_key = settings.supabase_api_key
supabase: Client = create_client(supabase_url, supabase_key)

def insert_satellite_data(data: SatelliteData):
    # Insert validated satellite data into Supabase table
    response = supabase.table("satellites").insert(data.dict()).execute()
    return response

def get_satellite_data_by_time(epoch: str):
    # Query satellite data by EPOCH
    response = supabase.table("satellites").select("*").eq("EPOCH", epoch).execute()
    return response

# Example: Cache new data every 2 hours (use a scheduler like APScheduler or Celery)
# def scheduled_update():
#     new_data = fetch_from_celeste()
#     for sat in new_data:
#         validated = SatelliteData(**sat)
#         insert_satellite_data(validated)
