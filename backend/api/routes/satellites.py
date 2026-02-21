from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Optional
from services.satellite_service import get_satellites_by_group, get_satellite_by_id
from models.satellite import SatelliteData

from services.supabase_service import supabase 

router = APIRouter()


@router.get("/satellites/cache")    
@router.api_route("/satellites/cache", methods=["GET", "POST"])
async def cache_satellites(group: str = Query(..., description="CelesTrak group name")):
    fetched_data = get_satellites_by_group(group)
    
    if not fetched_data:
        return {"status": "error", "message": "No data found for this group"}

    cat_response = supabase.table("categories").upsert(
        {"name": group}, on_conflict="name"
    ).execute()
    
    if not cat_response.data:
        cat_fetch = supabase.table("categories").select("id").eq("name", group).single().execute()
        category_id = cat_fetch.data['id']
    else:
        category_id = cat_response.data[0]['id']

    sats_to_upsert = []
    orbital_to_upsert = []
    mapping_to_upsert = []

    for sat in fetched_data:
        norad_id = sat["NORAD_CAT_ID"]
        sats_to_upsert.append({
            "norad_cat_id": norad_id,
            "object_name": sat["OBJECT_NAME"],
            "object_id": sat["OBJECT_ID"]
        })

        mapping_to_upsert.append({
            "norad_cat_id": norad_id,
            "category_id": category_id
        })

        orbital_to_upsert.append({
            "norad_cat_id": norad_id,
            "epoch": sat["EPOCH"],
            "mean_motion": sat["MEAN_MOTION"],
            "eccentricity": sat["ECCENTRICITY"],
            "inclination": sat["INCLINATION"],
            "ra_of_asc_node": sat["RA_OF_ASC_NODE"],
            "arg_of_pericenter": sat["ARG_OF_PERICENTER"],
            "mean_anomaly": sat["MEAN_ANOMALY"],
            "ephemeris_type": sat["EPHEMERIS_TYPE"],
            "classification_type": sat["CLASSIFICATION_TYPE"],
            "element_set_no": sat["ELEMENT_SET_NO"],
            "rev_at_epoch": sat["REV_AT_EPOCH"],
            "bstar": sat["BSTAR"],
            "mean_motion_dot": sat["MEAN_MOTION_DOT"],
            "mean_motion_ddot": sat["MEAN_MOTION_DDOT"]
        })

    try:
        chunk_size = 100 
        for i in range(0, len(sats_to_upsert), chunk_size):
            supabase.table("satellites").upsert(
                sats_to_upsert[i:i+chunk_size], on_conflict="norad_cat_id"
            ).execute()
            
            supabase.table("satellite_category_map").upsert(
                mapping_to_upsert[i:i+chunk_size], on_conflict="norad_cat_id,category_id"
            ).execute()
            
            supabase.table("orbital_elements").upsert(
                orbital_to_upsert[i:i+chunk_size], on_conflict="norad_cat_id"
            ).execute()

        return {"status": "success", "satellites_updated": len(fetched_data)}
        
    except Exception as e:
        print(f"Cache Error: {str(e)}")
        return {"status": "error", "details": str(e)}


@router.get("/satellites")
async def list_satellites(group: str = Query("visual", description="CelesTrak group (visual, active, stations, weather, etc.)")):
    db_response = supabase.table("satellites") \
        .select("*, satellite_category_map!inner(category_id, categories!inner(name))") \
        .eq("satellite_category_map.categories.name", group) \
        .execute()

    # 2. If data exists in DB, return it immediately
    if db_response.data and len(db_response.data) > 0:
        print(f"Serving '{group}' from database.")
        return db_response.data

    # 3. If no data, trigger the cache logic (fetch from API and save)
    print(f"Data for '{group}' not found. Fetching from CelesTrak...")
    cache_result = await cache_satellites(group=group)
    
    if cache_result.get("status") == "success":
        # Re-query the DB now that it's populated
        updated_db = supabase.table("satellites") \
            .select("*, satellite_category_map!inner(category_id, categories!inner(name))") \
            .eq("satellite_category_map.categories.name", group) \
            .execute()
        return updated_db.data
    
    return {"message": "Failed to fetch data from API", "details": cache_result}


# Gets a single satellite based by on id
@router.get("/satellites/{satellite_norad_id}", response_model=SatelliteData)
def get_satellite(satellite_norad_id: str):
    return get_satellite_by_id(satellite_norad_id)
