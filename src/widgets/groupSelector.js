// src/widgets/groupSelector.js

export function setupGroupSelector({ initialGroup = 'active', onGroupChange, mountTarget = null }) {
    const container = document.createElement('section');
    container.className = 'sidebar-widget tracked-group-widget';

    const title = document.createElement('h3');
    title.className = 'sidebar-widget__title';
    title.textContent = 'Tracked Group';

    const content = document.createElement('div');
    content.className = 'sidebar-widget__content tracked-group-widget__content';

    const label = document.createElement('label');
    label.className = 'tracked-group-widget__label';
    label.innerText = 'CelesTrak Group';
    label.htmlFor = 'satellite-group-select';
    
    // Create the dropdown
    const select = document.createElement('select');
    select.id = 'satellite-group-select';
    select.className = 'tracked-group-widget__select';

    // Add the CelesTrak groups
    const groups = [
        { value: 'active', label: 'Active (Top)' },
        { value: 'visual', label: 'Visual (Top 100)' },
        { value: 'stations', label: 'Space Stations' },
        { value: 'starlink', label: 'Starlink' },
        { value: 'weather', label: 'Weather' },
        { value: 'gps-ops', label: 'GPS Operational' }
    ];

    groups.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.value;
        opt.innerText = g.label;
        if (g.value === initialGroup) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    // Listen for changes and trigger the callback
    select.addEventListener('change', (e) => {
        if (onGroupChange) {
            onGroupChange(e.target.value);
        }
    });

    content.append(label, select);
    container.append(title, content);
    (mountTarget || document.body).appendChild(container);

    return {
        container,
        getValue: () => select.value
    };
}
