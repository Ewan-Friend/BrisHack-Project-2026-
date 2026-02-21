from fastapi import APIRouter, HTTPException
from typing import List
from services.satellite_service import get_top100_satellites 
from models.satellite import SatelliteData
from services.supabase_service import insert_satellite_data

router = APIRouter()


@router.get("/satellites/cache")
@router.post("/satellites/cache")
def cache_satellites():
    fetched_data = get_top100_satellites()
    results = []
    for sat in fetched_data:
        try:
            validated = SatelliteData(**sat)
            insert_satellite_data(validated)
            results.append({"object_id": validated.OBJECT_ID, "status": "success"})
        except Exception as e:
            results.append({"object_id": sat.get("OBJECT_ID", "unknown"), "error": str(e)})
    return {"results": results}

@router.get("/satellites")
def list_satellites():
    return get_top100_satellites()


@router.get("/satellites/{satellite_id}", response_model=SatelliteData)
def get_satellite(satellite_id: str):
    all_sats = get_top100_satellites()
    for sat in all_sats:
        if sat.get("OBJECT_ID") == satellite_id:
            return sat
    raise HTTPException(status_code=404, detail="Satellite not found")