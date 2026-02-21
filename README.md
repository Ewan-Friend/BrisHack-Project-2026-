# BrisHack Satellite Tracker

This project is a full-stack satellite tracking platform built for BrisHack. It features a FastAPI backend for real-time and historical satellite data, and a modern frontend for visualization and interaction.

## Features
- Fetches and validates satellite data from Celeste
- Stores satellite data in Supabase for caching and historical queries
- REST API endpoints for satellite information
- Scheduled updates every two hours
- Pydantic models for data validation
- Interactive frontend for satellite visualization and search

## Tech Stack
### Backend
- **FastAPI**: Web framework for building APIs
- **Celeste**: Satellite tracking and data provider
- **Supabase**: Database and authentication backend
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for FastAPI
- **Python**: Core language


### Frontend

## Setup
### Backend
1. Clone the repository
2. Create a virtual environment and install dependencies
3. Copy `backend/.env.example` to `backend/.env` and fill in your keys
4. Run the backend:
	- For development: `uvicorn backend.main:app --reload`
	- Or: `python3 backend/main.py reload`


### Frontend
1. Navigate to the frontend directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the Vite development server

## Folder Structure
- `backend/main.py`: FastAPI app entry point
- `backend/core/config.py`: Configuration and environment variables
- `backend/models/satellite.py`: Pydantic model for satellite data
- `backend/services/supabase_service.py`: Supabase integration
- `backend/api/routes/satellites.py`: API endpoints
- `frontend/`: Frontend application (React/Svelte/Vue)


## License
MIT