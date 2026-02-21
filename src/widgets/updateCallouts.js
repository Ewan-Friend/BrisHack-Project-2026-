import * as THREE from 'three';

export function updateCalloutReveal(calloutReveal) {
  if (!calloutReveal.active) {
    return calloutReveal.progress;
  }

  const elapsed = performance.now() - calloutReveal.startMs;
  const linear = THREE.MathUtils.clamp(elapsed / calloutReveal.durationMs, 0, 1);
  const eased = 1 - Math.pow(1 - linear, 3);
  calloutReveal.progress = eased;

  if (linear >= 1) {
    calloutReveal.active = false;
    calloutReveal.progress = 1;
  }

  return calloutReveal.progress;
}

export function updateCalloutTyping(calloutTyping, infoTitle, satelliteDetails) {
  if (!calloutTyping.active) {
    return;
  }

  const nowMs = performance.now();
  while (nowMs - calloutTyping.lastStepMs >= calloutTyping.stepIntervalMs) {
    calloutTyping.lastStepMs += calloutTyping.stepIntervalMs;

    if (calloutTyping.titleIndex < calloutTyping.titleTarget.length) {
      calloutTyping.titleIndex += 1;
      infoTitle.textContent = calloutTyping.titleTarget.slice(0, calloutTyping.titleIndex);
      continue;
    }

    if (calloutTyping.detailsIndex < calloutTyping.detailsTarget.length) {
      calloutTyping.detailsIndex += 1;
      satelliteDetails.textContent = calloutTyping.detailsTarget.slice(0, calloutTyping.detailsIndex);
      continue;
    }

    calloutTyping.active = false;
    break;
  }
}

export function updateSatelliteCallout(params) {
  const {
    selectedSatellite,
    isAnimatingCamera,
    infoBox,
    calloutLayout,
    projectedSatelliteScreen,
    camera,
    calloutTyping,
    infoTitle,
    satelliteDetails,
    measureCalloutTitleWidth,
    calloutReveal,
    infoCard,
    infoConnectorPath,
    infoConnectorStart
  } = params;

  if (!selectedSatellite) {
    infoBox.classList.remove('visible');
    calloutLayout.initialized = false;
    return;
  }

  if (isAnimatingCamera) {
    infoBox.classList.remove('visible');
    return;
  }

  projectedSatelliteScreen.copy(selectedSatellite.mesh.position).project(camera);

  if (projectedSatelliteScreen.z < -1 || projectedSatelliteScreen.z > 1) {
    infoBox.classList.remove('visible');
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const satX = (projectedSatelliteScreen.x * 0.5 + 0.5) * width;
  const satY = (-projectedSatelliteScreen.y * 0.5 + 0.5) * height;

  updateCalloutTyping(calloutTyping, infoTitle, satelliteDetails);

  const fullTitleText = calloutTyping.titleTarget || infoTitle.textContent || '';
  const measuredTitleWidth = Math.max(120, measureCalloutTitleWidth(fullTitleText));
  const targetCalloutWidth = THREE.MathUtils.clamp(measuredTitleWidth + 36, 180, 300);

  const targetP0x = THREE.MathUtils.clamp(satX - targetCalloutWidth - 120, 24, width - targetCalloutWidth - 24);
  const targetP0y = THREE.MathUtils.clamp(satY - 100, 28, height - 170);

  if (!calloutLayout.initialized) {
    calloutLayout.initialized = true;
    calloutLayout.p0x = targetP0x;
    calloutLayout.p0y = targetP0y;
    calloutLayout.width = targetCalloutWidth;
  } else {
    const follow = isAnimatingCamera ? 0.2 : 0.35;
    calloutLayout.p0x = THREE.MathUtils.lerp(calloutLayout.p0x, targetP0x, follow);
    calloutLayout.p0y = THREE.MathUtils.lerp(calloutLayout.p0y, targetP0y, follow);
    calloutLayout.width = THREE.MathUtils.lerp(calloutLayout.width, targetCalloutWidth, 0.28);
  }

  const p0x = calloutLayout.p0x;
  const p0y = calloutLayout.p0y;
  const calloutWidth = calloutLayout.width;
  const p1x = p0x + calloutWidth;
  const p1y = p0y;

  const titleX = p0x + 16;
  const titleY = p0y - 38;
  const cardX = p0x;
  const cardY = p0y + 12;

  infoCard.style.width = `${calloutWidth}px`;

  infoTitle.style.transform = `translate(${titleX}px, ${titleY}px)`;
  infoCard.style.transform = `translate(${cardX}px, ${cardY}px)`;

  const p3x = satX;
  const p3y = satY;

  const revealProgress = updateCalloutReveal(calloutReveal);
  const seg1Length = Math.hypot(p1x - p0x, p1y - p0y);
  const seg2Length = Math.hypot(p3x - p1x, p3y - p1y);
  const totalLength = Math.max(0.0001, seg1Length + seg2Length);
  const revealDistance = totalLength * revealProgress;

  let connectorPoints = `${p0x},${p0y} ${p0x},${p0y} ${p0x},${p0y}`;

  if (revealDistance <= seg1Length) {
    const t = seg1Length > 0 ? revealDistance / seg1Length : 1;
    const ex = THREE.MathUtils.lerp(p0x, p1x, t);
    const ey = THREE.MathUtils.lerp(p0y, p1y, t);
    connectorPoints = `${p0x},${p0y} ${ex},${ey} ${ex},${ey}`;
  } else {
    const secondDistance = revealDistance - seg1Length;
    const t = seg2Length > 0 ? THREE.MathUtils.clamp(secondDistance / seg2Length, 0, 1) : 1;
    const ex = THREE.MathUtils.lerp(p1x, p3x, t);
    const ey = THREE.MathUtils.lerp(p1y, p3y, t);
    connectorPoints = `${p0x},${p0y} ${p1x},${p1y} ${ex},${ey}`;
  }

  infoConnectorPath.setAttribute('points', connectorPoints);
  infoConnectorStart.setAttribute('cx', String(p0x));
  infoConnectorStart.setAttribute('cy', String(p0y));

  infoBox.classList.add('visible');
}
