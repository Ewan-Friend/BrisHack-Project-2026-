import * as THREE from 'three';
import * as satellite from 'satellite.js';

export function updateSatellites(params) {
    const { activeSatellites, TRAIL_POINTS, TRAIL_LENGTH_MINUTES } = params;
    const now = new Date();

    activeSatellites.forEach(sat => {
        const flatPositionsArray = [];

        const posAndVel = satellite.propagate(sat.satrec, now);
        if (posAndVel.position) {
            const gmst = satellite.gstime(now);
            const posGd = satellite.eciToGeodetic(posAndVel.position, gmst);
            const r = 1 + (posGd.height / 6371);
            sat.mesh.position.set(
                r * Math.cos(posGd.latitude) * Math.cos(posGd.longitude),
                r * Math.sin(posGd.latitude),
                r * Math.cos(posGd.latitude) * Math.sin(-posGd.longitude)
            );
            sat.altitudeKm = posGd.height;

            if (posAndVel.velocity) {
                sat.speedKms = Math.sqrt(
                    (posAndVel.velocity.x * posAndVel.velocity.x) +
                    (posAndVel.velocity.y * posAndVel.velocity.y) +
                    (posAndVel.velocity.z * posAndVel.velocity.z)
                );
            }

            sat.angleDeg = (THREE.MathUtils.radToDeg(Math.atan2(sat.mesh.position.z, sat.mesh.position.x)) + 360) % 360;
        }

        for (let i = 0; i < TRAIL_POINTS; i++) {
            const timeOffsetMs = (TRAIL_POINTS - 1 - i) * (TRAIL_LENGTH_MINUTES * 60000 / TRAIL_POINTS);
            const historicalTime = new Date(now.getTime() - timeOffsetMs);
            const pastPosVel = satellite.propagate(sat.satrec, historicalTime);

            if (pastPosVel.position) {
                const pastGmst = satellite.gstime(historicalTime);
                const pastGd = satellite.eciToGeodetic(pastPosVel.position, pastGmst);
                const pastR = 1 + (pastGd.height / 6371);

                flatPositionsArray.push(
                    pastR * Math.cos(pastGd.latitude) * Math.cos(pastGd.longitude),
                    pastR * Math.sin(pastGd.latitude),
                    pastR * Math.cos(pastGd.latitude) * Math.sin(-pastGd.longitude)
                );
            } else {
                flatPositionsArray.push(0, 0, 0);
            }
        }

        sat.trailGeometry.setPositions(flatPositionsArray);
    });
}
