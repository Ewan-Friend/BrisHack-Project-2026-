import * as THREE from 'three';
import * as satellite from "satellite.js"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

// --- Renderer ---

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// --- Scene & Camera ---

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

// --- Controls ---

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.5;
controls.maxDistance = 10;

// --- Texture Loading ---
// Color map: Blue Marble (sRGB)
// Normal map: Tangent-space Earth normals (linear / no color space)
// Specular map: Used as inverse roughness — oceans are shiny, land is matte (linear)

const loader = new THREE.TextureLoader();

const colorMap = loader.load('https://unpkg.com/three-globe@2.35.0/example/img/earth-blue-marble.jpg');
colorMap.colorSpace = THREE.SRGBColorSpace;

const normalMap = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
normalMap.colorSpace = THREE.NoColorSpace;

const specularMap = loader.load('https://unpkg.com/three-globe@2.35.0/example/img/earth-water.png');

const cityLightsMap = loader.load('https://unpkg.com/three-globe@2.35.0/example/img/earth-night.jpg');
cityLightsMap.colorSpace = THREE.SRGBColorSpace;

// --- Globe (PBR Material) ---
// metalness kept low — Earth is mostly dielectric
// roughnessMap uses the specular/water map so oceans appear glossy
// normalScale adds visible but subtle terrain relief

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.25, 0.25),
    roughnessMap: specularMap,
    roughness: 0.9,
    metalness: 0.02,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: cityLightsMap,
    emissiveIntensity: 1.6,
  })
);
globe.material.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <roughnessmap_fragment>',
    `
    float roughnessFactor = roughness;
    #ifdef USE_ROUGHNESSMAP
      vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
      // Invert the green channel so water (white) becomes smooth (0.0) and land (black) becomes rough (1.0)
      // Clamp slightly so ocean is not a perfect mirror.
      roughnessFactor *= clamp(1.0 - texelRoughness.g, 0.4, 1.0);
    #endif
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    `#include <emissivemap_fragment>
    #if NUM_DIR_LIGHTS > 0
      float sunNdotL = dot(normal, directionalLights[0].direction);
      float nightMask = 1.0 - smoothstep(-0.15, 0.08, sunNdotL);
      totalEmissiveRadiance *= pow(nightMask, 1.5);
    #endif`
  );
};
scene.add(globe);

// --- Starfield ---
// 2000 random points scattered in a large cube around the scene

const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 200;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })
);
scene.add(stars);

// --- Lighting ---
// Hemisphere approximates sky/ground bounce while directional acts as the sun.
scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x1f120a, 0.05));

const sunLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0x9fc9ff, 0.08);
rimLight.position.set(-4, -2, -3);
scene.add(rimLight);

// --------------- SATELLITES ---------------

// The dictionary
const satelliteDataMap = {};
const activeSatellites = [];

// Creating the visual marker (the red dot)
const TRAIL_LENGTH_MINUTES = 5; // How long you want the tail to be
const TRAIL_POINTS = 20; // Smoothness of the tail

const initialPositions = [];
for (let i = 0; i < TRAIL_POINTS; i++) {
    initialPositions.push(0, 0, 0);
}

const sharedTrailMaterial = new LineMaterial({
    color: 0xffffff, // Use white so vertex colors show through correctly
    linewidth: 4,    // CHANGE THIS NUMBER TO MAKE IT WIDER/THINNER
    vertexColors: true, // Necessary for gradient
    dashed: false,
    alphaToCoverage: true, // Helps edges look smoother
});

sharedTrailMaterial.resolution.set(window.innerWidth, window.innerHeight);

const sharedSatGeometry = new THREE.SphereGeometry(0.015,16,16)

function getSatelliteColor(jsonData) {
    const revsPerDay = jsonData.MEAN_MOTION;

    // Keep GEO and MEO just in case you add other data types later!
    if (revsPerDay > 0.9 && revsPerDay < 1.1) return new THREE.Color(0x00ff00); // GEO (Green)
    if (revsPerDay > 1.9 && revsPerDay < 2.2) return new THREE.Color(0x00aaff); // MEO (Blue)

    // Detailed LEO Breakdown for your specific dataset
    if (revsPerDay >= 11 && revsPerDay < 13) {
        return new THREE.Color(0xcc00ff); // Purple (~11-12 revs/day - Higher LEO)
    }
    else if (revsPerDay >= 13 && revsPerDay < 14) {
        return new THREE.Color(0x00ffff); // Cyan (~13 revs/day)
    }
    else if (revsPerDay >= 14 && revsPerDay < 15) {
        return new THREE.Color(0xffff00); // Yellow (~14 revs/day - Very common)
    }
    else if (revsPerDay >= 15 && revsPerDay < 16) {
        return new THREE.Color(0xff6600); // Orange (~15 revs/day - Very common, lower altitude)
    }
    else if (revsPerDay >= 16) {
        return new THREE.Color(0xff0000); // Red (16+ revs/day - Extremely fast, very low altitude)
    }

    return new THREE.Color(0xffffff); // Catch-all Fallback (White)
}

function buildSatelliteMeshes() {
    Object.keys(satelliteDataMap).forEach(satId => {
        const jsonData = satelliteDataMap[satId];
        const satrec = satellite.json2satrec(jsonData);
        const satColor = getSatelliteColor(jsonData);

        const trailColors = [];
        const colorHelper = new THREE.Color();
        for (let i = 0; i < TRAIL_POINTS; i++) {
            const t = i / (TRAIL_POINTS - 1);
            colorHelper.setRGB(satColor.r * t, satColor.g * t, satColor.b * t);
            trailColors.push(colorHelper.r, colorHelper.g, colorHelper.b);
        }

        const trailGeo = new LineGeometry();
        trailGeo.setPositions(initialPositions);
        trailGeo.setColors(trailColors); // Or your custom colors from the previous step!

        const trailLine = new Line2(trailGeo, sharedTrailMaterial);
        scene.add(trailLine);

        const uniqueSatMaterial = new THREE.MeshBasicMaterial({color: satColor});
        const satMesh = new THREE.Mesh(sharedSatGeometry, uniqueSatMaterial);
        scene.add(satMesh);

        activeSatellites.push({
            id: satId,
            satrec: satrec,
            mesh: satMesh,
            trailGeometry: trailGeo
        });
    });
}

async function loadSatellites() {
    try {
        const response = await fetch('https://bris-hack-project-2026.vercel.app/satellites');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const jsonArray = await response.json();

        jsonArray.forEach(satelliteObj => {
            satelliteDataMap[satelliteObj.OBJECT_ID] = satelliteObj;
        });

        console.log(`Successfully loaded ${jsonArray.length} satellites.`);
        buildSatelliteMeshes();

    } catch (error) {
        console.error("Failed to load satellites. Check if your Python server is running and CORS is enabled.", error);
    }
}

loadSatellites();


// --- 2. THE UPDATE FUNCTION ---
function updateSatellites() {
    const now = new Date();

    // Loop through every active satellite
    activeSatellites.forEach(sat => {
        const flatPositionsArray = [];

        // A. Update the Main Satellite Dot
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
        }

        // B. Dynamically generate the trailing line
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
                // Fallback: If SGP4 math fails for an old point, push 0,0,0 to prevent Line2 crashes
                flatPositionsArray.push(0, 0, 0);
            }
        }

        // Apply new positions to this specific satellite's trail
        sat.trailGeometry.setPositions(flatPositionsArray);
    });
}

// --- Resize Handling ---

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  sharedTrailMaterial.resolution.set(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---

renderer.setAnimationLoop(() => {
    updateSatellites();
    controls.update();
    renderer.render(scene, camera);
});
