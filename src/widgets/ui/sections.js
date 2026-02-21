export function createLayerToggle(labelText, layerMesh) {
  const toggleRow = document.createElement('label');
  toggleRow.className = 'sidebar-switch';

  const label = document.createElement('span');
  label.textContent = labelText;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'sidebar-switch__input';
  checkbox.checked = Boolean(layerMesh && layerMesh.visible);
  checkbox.addEventListener('change', () => {
    if (layerMesh) {
      layerMesh.visible = checkbox.checked;
    }
  });

  const slider = document.createElement('span');
  slider.className = 'sidebar-switch__slider';

  toggleRow.append(label, checkbox, slider);
  return toggleRow;
}

export function mountSatelliteSearchSection({ sidebarContent, createWidget }) {
  if (!sidebarContent) {
    return;
  }

  const { container, contentArea } = createWidget('Satellite Search');
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'sidebar-search';
  searchInput.placeholder = 'Search satellites (placeholder)';

  const hint = document.createElement('p');
  hint.className = 'sidebar-hint';
  hint.textContent = 'UI placeholder only, no filtering wired yet.';

  contentArea.append(searchInput, hint);
  sidebarContent.appendChild(container);
}

export function mountEnvironmentLayersSection({ sidebarContent, createWidget, environmentLayers }) {
  const { cloudLayer, atmosphereLayer } = environmentLayers || {};
  if (!sidebarContent) {
    return;
  }

  const { container, contentArea } = createWidget('Environment Layers');
  contentArea.appendChild(createLayerToggle('Clouds', cloudLayer));
  contentArea.appendChild(createLayerToggle('Atmosphere', atmosphereLayer));
  sidebarContent.appendChild(container);
}

export function mountFooterControlsSection({
  sidebar,
  postProcessing,
  centerLocationButton,
  onResetCameraView,
}) {
  const { cycleMode, getActiveMode } = postProcessing || {};
  if (!sidebar) {
    return;
  }

  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  const leftControls = document.createElement('div');
  leftControls.className = 'sidebar-footer-left';

  if (cycleMode && getActiveMode) {
    const postFxButton = document.createElement('button');
    postFxButton.type = 'button';
    postFxButton.className = 'sidebar-postfx-button';

    const syncLabel = () => {
      const activeMode = getActiveMode();
      postFxButton.textContent = `FX ${activeMode.label}`;
    };

    postFxButton.addEventListener('click', () => {
      cycleMode();
      syncLabel();
    });

    syncLabel();
    leftControls.appendChild(postFxButton);
  }

  if (typeof onResetCameraView === 'function') {
    const resetViewButton = document.createElement('button');
    resetViewButton.type = 'button';
    resetViewButton.className = 'sidebar-reset-button';
    resetViewButton.textContent = 'Reset View';
    resetViewButton.addEventListener('click', () => {
      onResetCameraView();
    });
    leftControls.appendChild(resetViewButton);
  }

  if (leftControls.childElementCount > 0) {
    footer.appendChild(leftControls);
  }

  const locationButton = centerLocationButton || document.getElementById('centerLocationButton');
  if (locationButton) {
    footer.appendChild(locationButton);
  }

  sidebar.appendChild(footer);
}
