export async function getActiveStorms() {
    // NASA EONET v3 API - Filtering for currently open Severe Storms
    const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms&status=open';
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('NASA API failed');
        
        const data = await response.json();
        
        // Map NASA's GeoJSON format into a simple array for our 3D globe
        return data.events.map(event => {
            // Some events have tracking paths; we just want the latest position
            const latestLocation = event.geometry[event.geometry.length - 1];
            
            return {
                id: event.id,
                title: event.title,
                // GeoJSON coordinates are always [longitude, latitude]
                longitude: latestLocation.coordinates[0],
                latitude: latestLocation.coordinates[1],
                date: latestLocation.date
            };
        });
    } catch (error) {
        console.error("Error fetching NASA storm data:", error);
        return [];
    }
}