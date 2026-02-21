import * as THREE from 'three';
import { getUserLocation } from '../services/locationService'

/**
 * Add a marker at the user's current location on the Earth
 * @param {THREE.Scene} scene - The Three.js scene to add the marker to
 * @param {Object} options - Optional configuration
 * @param {number} options.size - Marker height in world units (default: 0.045)
 * @param {number} options.color - Marker color in hex (default: 0xff0000)
 */
export async function addUserLocationMarker(scene, options = {}) {
  const { size = 0.045, color = 0xff0000 } = options;
  
  try {
    const location = await getUserLocation();
    const { latitude, longitude } = location;
    
    // Convert lat/lon to 3D coordinates on sphere (matching satellite positioning)
    const lat = latitude * Math.PI / 180;
    const lon = longitude * Math.PI / 180;
    const radius = 1; // Earth radius
    
    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(-lon);
    
    // Lucide map-pin as an SVG texture.
    const stroke = `#${new THREE.Color(color).getHexString()}`;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22.9" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `.trim();

    const markerTexture = new THREE.TextureLoader().load(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    );
    markerTexture.colorSpace = THREE.SRGBColorSpace;

    const markerMaterial = new THREE.SpriteMaterial({
      map: markerTexture,
      transparent: true,
      depthWrite: false,
    });
    const marker = new THREE.Sprite(markerMaterial);
    
    marker.position.set(x, y, z);
    // Anchor the sprite by its bottom-center so the pin tip sits on the location.
    marker.center.set(0.5, 0);
    const iconAspect = 24 / 22.9;
    marker.scale.set(size * iconAspect, size, 1);
    scene.add(marker);

    return { latitude, longitude, marker };
  } catch (error) {
    return null;
  }
}
