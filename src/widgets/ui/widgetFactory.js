export function createWidget(title) {
  const container = document.createElement('section');
  container.className = 'sidebar-widget';

  const heading = document.createElement('h2');
  heading.className = 'sidebar-widget__title';
  heading.textContent = title;

  const contentArea = document.createElement('div');
  contentArea.className = 'sidebar-widget__content';

  container.append(heading, contentArea);
  return { container, contentArea, heading };
}
