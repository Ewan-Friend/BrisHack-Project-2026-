import os
from supabase import create_client, Client
from core.config import settings

# Initialize once here
supabase_url = settings.supabase_url
supabase_key = settings.supabase_api_key

# This is the actual live object you use to run .table().upsert()
supabase: Client = create_client(supabase_url, supabase_key)
