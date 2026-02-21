import * as service from '../api/satelliteService.js';
import { buildSatelliteMeshes } from './buildSatelliteMeshes.js';

export async function loadSatellites(params) {
    const { satelliteDataMap, scene, activeSatellites, getSatelliteColor, TRAIL_POINTS, initialPositions, sharedTrailMaterial, sharedSatGeometry } = params;
    
    try {
        const jsonArray = await service.getAllSatellites();
        jsonArray.forEach(satelliteObj => {
            satelliteDataMap[satelliteObj.OBJECT_ID] = satelliteObj;
        });

        console.log(`Loaded ${jsonArray.length} satellites`);
        buildSatelliteMeshes({
            satelliteDataMap,
            scene,
            activeSatellites,
            getSatelliteColor,
            TRAIL_POINTS,
            initialPositions,
            sharedTrailMaterial,
            sharedSatGeometry
        });
    } catch (error) {
        console.error('Failed to load satellites:', error);
    }
}
