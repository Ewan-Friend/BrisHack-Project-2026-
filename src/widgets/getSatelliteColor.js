import * as THREE from 'three';

export function getSatelliteColor(jsonData) {
    const name = jsonData.OBJECT_NAME.toUpperCase();

    if (name.includes('COSMOS') || name.startsWith('SL-') ||
        name.includes('INTERCOSMOS') || name.includes('RESURS') ||
        name.includes('OKEAN') || name.includes('ZARYA')) {
        return new THREE.Color(0xff2222);
    }
    else if (name.startsWith('CZ-') || name.includes('SHIJIAN') ||
        name.includes('YAOGAN') || name.includes('HXMT') ||
        name.includes('CSS') || name.startsWith('SZ-')) {
        return new THREE.Color(0xffcc00);
    }
    else if (name.includes('ARIANE') || name.includes('ENVISAT') || name.includes('HELIOS')) {
        return new THREE.Color(0x3388ff);
    }
    else if (name.includes('H-2A') || name.includes('ALOS') ||
        name.includes('ASTRO') || name.includes('AJISAI') ||
        name.includes('MIDORI') || name.includes('XRISM')) {
        return new THREE.Color(0xffffff);
    }
    else if (name.includes('ATLAS') || name.includes('DELTA') ||
        name.includes('THOR') || name.includes('TITAN') ||
        name.startsWith('USA ') || name.includes('OAO') ||
        name.includes('SERT') || name.includes('SEASAT') ||
        name.includes('AQUA') || name.includes('HST') || name.includes('ACS3')) {
        return new THREE.Color(0x00ffff);
    }
    else if (name.includes('GSLV')) {
        return new THREE.Color(0xff8800);
    }

    return new THREE.Color(0xcc55ff);
}
