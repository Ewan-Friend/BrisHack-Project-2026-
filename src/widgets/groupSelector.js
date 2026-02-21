// src/widgets/groupSelector.js

export function setupGroupSelector({ initialGroup = 'active', onGroupChange }) {
    // Create the container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    
    // --- POSITION CHANGED TO TOP LEFT ---
    container.style.top = '64px'; // 64px puts it nicely below your Post FX button
    container.style.left = '16px'; 
    // ------------------------------------
    
    container.style.zIndex = '100';
    container.style.background = 'rgba(8, 18, 34, 0.7)';
    container.style.border = '1px solid rgba(180, 215, 255, 0.45)';
    container.style.borderRadius = '10px';
    container.style.padding = '8px 12px';
    container.style.color = '#d7ecff';
    container.style.fontFamily = 'system-ui, -apple-system, Segoe UI, sans-serif';
    container.style.fontSize = '14px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '10px';

    const label = document.createElement('label');
    label.innerText = 'Tracked Group:';
    label.htmlFor = 'satellite-group-select';
    
    // Create the dropdown
    const select = document.createElement('select');
    select.id = 'satellite-group-select';
    select.style.background = 'transparent';
    select.style.color = '#fff';
    select.style.border = '1px solid rgba(180, 215, 255, 0.45)';
    select.style.borderRadius = '6px';
    select.style.padding = '4px 8px';
    select.style.cursor = 'pointer';
    select.style.fontFamily = 'inherit';

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
        opt.style.background = '#081222'; 
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

    container.appendChild(label);
    container.appendChild(select);
    document.body.appendChild(container);

    return {
        container,
        getValue: () => select.value
    };
}