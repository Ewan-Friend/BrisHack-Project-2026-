import { SIDEBAR_ID, SIDEBAR_STYLE_ID } from './constants.js';

export function ensureSidebarStyles() {
  if (document.getElementById(SIDEBAR_STYLE_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Electrolize:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const styleTag = document.createElement('style');
  styleTag.id = SIDEBAR_STYLE_ID;
  styleTag.textContent = `
* { font-family: Electrolize, sans-serif !important; }

#${SIDEBAR_ID} {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 14px;
  background-color: #000000 !important;
  background: #000000 !important;
  z-index: 101;
  overflow: hidden;
}

#${SIDEBAR_ID}.is-collapsed {
  width: 0;
  height: 0;
  padding: 0;
  background: transparent;
  overflow: visible;
}

.sidebar-topbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

#${SIDEBAR_ID}.is-collapsed .sidebar-topbar {
  position: fixed;
  top: 25px;
  right: 8px;
  transform: translateY(-50%);
  justify-content: center;
  margin-bottom: 0;
}

.sidebar-collapse-toggle {
  width: 30px;
  height: 30px;
  background: transparent !important;
  color: #18f5ff !important;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  border: none !important;
  padding: 0;
}

.sidebar-collapse-toggle:hover {
  opacity: 0.8;
}

.sidebar-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 2px;
}

.sidebar-widget {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.sidebar-widget__title {
  margin: 0 !important;
  padding: 12px 0 10px 0 !important;
  color: #18f5ff !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none !important;
}

.sidebar-widget__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 !important;
  color: #18f5ff !important;
  font-size: 13px !important;
}

.sidebar-search {
  width: 100%;
  box-sizing: border-box;
  background: transparent !important;
  color: #18f5ff !important;
  padding: 10px 0 !important;
  font-size: 13px !important;
  outline: none;
  border: none !important;
  border-bottom: 1px solid #18f5ff !important;
}

.sidebar-search::placeholder {
  color: rgba(24, 245, 255, 0.5);
}

.sidebar-search:focus {
  border-bottom: 1px solid #18f5ff !important;
  box-shadow: none !important;
}

.sidebar-hint {
  margin: 0 !important;
  color: #18f5ff !important;
  font-size: 11px !important;
  opacity: 0.7;
}

.sidebar-switch {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  color: #18f5ff !important;
  font-weight: 600;
}

.sidebar-switch__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.sidebar-switch__slider {
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: #333 !important;
  position: relative;
}

.sidebar-switch__slider::after {
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #18f5ff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.18s ease;
}

.sidebar-switch__input:checked + .sidebar-switch__slider {
  background: #18f5ff !important;
}

.sidebar-switch__input:checked + .sidebar-switch__slider::after {
  background: #000;
  transform: translateX(16px);
}

.sidebar-footer {
  margin-top: 12px;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: none !important;
}

.sidebar-footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

#${SIDEBAR_ID}.is-collapsed .sidebar-content,
#${SIDEBAR_ID}.is-collapsed .sidebar-footer {
  display: none;
}

.sidebar-postfx-button,
.sidebar-reset-button {
  background: transparent !important;
  color: #18f5ff !important;
  padding: 7px 11px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  border: none !important;
}

.sidebar-postfx-button:hover,
.sidebar-reset-button:hover {
  opacity: 0.7;
}

.tracked-group-widget {
  background: transparent !important;
}

.tracked-group-widget__label {
  color: #18f5ff !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tracked-group-widget__select {
  width: 100%;
  box-sizing: border-box;
  background: transparent !important;
  color: #18f5ff !important;
  padding: 8px 0 !important;
  font-size: 13px !important;
  outline: none;
  cursor: pointer;
  border: none !important;
  border-bottom: 1px solid #18f5ff !important;
}

.tracked-group-widget__select:focus {
  border-bottom: 1px solid #18f5ff !important;
  box-shadow: none !important;
}

.tracked-group-widget__select option {
  background: #000;
  color: #18f5ff;
}

#${SIDEBAR_ID} #centerLocationButton {
  position: static;
  width: 40px;
  height: 40px;
  margin-left: auto;
  border-radius: 0;
  border: none !important;
  background: transparent !important;
  color: #18f5ff !important;
  box-shadow: none !important;
  z-index: 0;
  cursor: pointer;
}

#${SIDEBAR_ID} #centerLocationButton:hover:enabled {
  opacity: 0.7;
}

#${SIDEBAR_ID} #centerLocationButton:active:enabled {
  opacity: 0.5;
}

#${SIDEBAR_ID} #centerLocationButton:disabled {
  background: transparent !important;
  color: #18f5ff !important;
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  #${SIDEBAR_ID} {
    width: min(260px, 76vw);
    padding: 10px;
  }

  #${SIDEBAR_ID}.is-collapsed .sidebar-topbar {
    top: 6px;
    right: 6px;
  }

  .sidebar-collapse-toggle {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }

  #${SIDEBAR_ID} #centerLocationButton {
    width: 34px;
    height: 34px;
  }
}
  `;

  document.head.appendChild(styleTag);
}

export function ensureTopBarStyles() {
  if (document.getElementById('topbar-style-id')) {
    return;
  }

  const styleTag = document.createElement('style');
  styleTag.id = 'topbar-style-id';
  styleTag.textContent = `
    #topBar {
      position: fixed;
      top: 10px;
      left: 12px;
      right: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      z-index: 50;
      background: transparent;
      border: 0;
      box-shadow: none;
      overflow: visible;
    }

    #topBar::after {
      content: none;
    }

    #topBar h1 {
      margin: 0;
      font-size: 22px;
      color: #18f5ff;
      font-weight: 700;
      font-family: Electrolize, 'Segoe UI', sans-serif;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      padding-bottom: 4px;
    }

    #topBar h1::after {
      content: "";
      position: absolute;
      left: 0;
      width: 155%;
      bottom: 0;
      height: 2px;
      background: linear-gradient(to right, rgba(24, 245, 255, 0.5), rgba(24, 245, 255, 0));
      pointer-events: none;
    }

    .header-logo {
      height: 30px;
      width: 30px;
    }

    #topBar a {
      color: #18f5ff;
      text-decoration: none;
      font-size: 14px;
      font-family: Electrolize, 'Segoe UI', sans-serif;
      margin-left: 24px;
      padding: 4px 8px;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }

    #topBar a:hover {
      border-bottom-color: #18f5ff;
    }

canvas {
  display: block;
  margin-top: 0;
}
  `;

  document.head.appendChild(styleTag);
}
