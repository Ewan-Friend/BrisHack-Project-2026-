import { SIDEBAR_ID } from './ui/constants.js';
import { ensureSidebarStyles } from './ui/styles.js';
import { createWidget as makeWidget } from './ui/widgetFactory.js';
import { createSidebarShell } from './ui/sidebarShell.js';
import {
  mountEnvironmentLayersSection,
  mountFooterControlsSection,
  mountSatelliteSearchSection,
} from './ui/sections.js';

export class UIManager {
  constructor({ postProcessing, environmentLayers, centerLocationButton }) {
    this.postProcessing = postProcessing;
    this.environmentLayers = environmentLayers;
    this.centerLocationButton = centerLocationButton;

    this.sidebar = null;
    this.sidebarContent = null;
    this.collapseButton = null;
    this.sidebarShell = null;
    this.isCollapsed = false;
  }

  createWidget(title) {
    return makeWidget(title);
  }

  createSidebarContainer() {
    this.sidebarShell = createSidebarShell({
      sidebarId: SIDEBAR_ID,
      initialCollapsed: false,
      onToggleCollapsed: (collapsed) => {
        this.isCollapsed = collapsed;
      },
    });

    this.sidebar = this.sidebarShell.sidebar;
    this.sidebarContent = this.sidebarShell.sidebarContent;
    this.collapseButton = this.sidebarShell.collapseButton;
    this.isCollapsed = this.sidebarShell.isCollapsed();
  }

  setCollapsed(collapsed) {
    if (!this.sidebarShell) {
      return;
    }

    this.sidebarShell.setCollapsed(collapsed);
    this.isCollapsed = this.sidebarShell.isCollapsed();
  }

  mountSatelliteSearchWidget() {
    mountSatelliteSearchSection({
      sidebarContent: this.sidebarContent,
      createWidget: (title) => this.createWidget(title),
    });
  }

  mountEnvironmentLayersWidget() {
    mountEnvironmentLayersSection({
      sidebarContent: this.sidebarContent,
      createWidget: (title) => this.createWidget(title),
      environmentLayers: this.environmentLayers,
    });
  }

  mountFooterControls() {
    mountFooterControlsSection({
      sidebar: this.sidebar,
      postProcessing: this.postProcessing,
      centerLocationButton: this.centerLocationButton,
    });
  }

  mount() {
    ensureSidebarStyles();
    this.createSidebarContainer();
    this.mountSatelliteSearchWidget();
    this.mountEnvironmentLayersWidget();
    this.mountFooterControls();
  }
}

export function setupSidebar(config) {
  const uiManager = new UIManager(config);
  uiManager.mount();
  return uiManager;
}
