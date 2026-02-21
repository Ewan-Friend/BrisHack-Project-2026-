import { createWidget } from './ui/widgetFactory.js';

export function createPlaybackWidget(onMultiplierChange) {
  const { container, content } = createWidget('Time Control');

  const controlsContainer = document.createElement('div');
  controlsContainer.style.display = 'flex';
  controlsContainer.style.flexDirection = 'column';
  controlsContainer.style.gap = '10px';

  // Display for current speed
  const speedLabel = document.createElement('div');
  speedLabel.innerHTML = `Speed: <strong>1x</strong> (Real-time)`;
  speedLabel.style.fontSize = '0.9rem';

  // The Slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '-50';
  slider.max = '50';
  slider.value = '1';
  slider.step = '1';
  slider.className = 'playback-slider'; // You can style this in styles.js
  slider.style.width = '100%';

  // Reset Button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset to Real-time';
  resetBtn.style.padding = '4px 8px';
  resetBtn.style.cursor = 'pointer';

  const updateSpeed = (val) => {
    const multiplier = parseFloat(val);
    speedLabel.innerHTML = `Speed: <strong>${multiplier}x</strong> ${multiplier === 0 ? '(Paused)' : ''}`;
    onMultiplierChange(multiplier);
  };

  slider.addEventListener('input', (e) => updateSpeed(e.target.value));
  
  resetBtn.addEventListener('click', () => {
    slider.value = 1;
    updateSpeed(1);
  });

  controlsContainer.append(speedLabel, slider, resetBtn);
  content.appendChild(controlsContainer);

  return container;
}