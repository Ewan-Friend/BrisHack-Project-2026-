export function createSidebarShell({ sidebarId, initialCollapsed = false, onToggleCollapsed }) {
  const existingSidebar = document.getElementById(sidebarId);
  if (existingSidebar) {
    existingSidebar.remove();
  }

  const sidebar = document.createElement('aside');
  sidebar.id = sidebarId;

  const topBar = document.createElement('div');
  topBar.className = 'sidebar-topbar';

  const collapseButton = document.createElement('button');
  collapseButton.type = 'button';
  collapseButton.className = 'sidebar-collapse-toggle';
  topBar.appendChild(collapseButton);

  const sidebarContent = document.createElement('div');
  sidebarContent.className = 'sidebar-content';

  sidebar.append(topBar, sidebarContent);
  document.body.appendChild(sidebar);

  let collapsed = Boolean(initialCollapsed);

  const syncCollapseState = () => {
    sidebar.classList.toggle('is-collapsed', collapsed);
    collapseButton.textContent = collapsed ? '<' : '>';
    collapseButton.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    collapseButton.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  };

  collapseButton.addEventListener('click', () => {
    collapsed = !collapsed;
    syncCollapseState();

    if (typeof onToggleCollapsed === 'function') {
      onToggleCollapsed(collapsed);
    }
  });

  syncCollapseState();

  return {
    sidebar,
    sidebarContent,
    collapseButton,
    isCollapsed: () => collapsed,
    setCollapsed: (value) => {
      collapsed = Boolean(value);
      syncCollapseState();
    },
  };
}
