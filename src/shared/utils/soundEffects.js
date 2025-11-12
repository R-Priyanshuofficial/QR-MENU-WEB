// Refined confirmation sound - Pleasant two-tone chime
export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // First tone
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800, audioContext.currentTime);
    gain1.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.15);
    
    // Second tone - higher pitch for pleasant confirmation
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, audioContext.currentTime + 0.08);
    gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.08);
    gain2.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    osc2.start(audioContext.currentTime + 0.08);
    osc2.stop(audioContext.currentTime + 0.25);
  } catch (error) {
    console.log('Sound playback not supported:', error);
  }
};

// Premium click/tap sound effect - Subtle and sophisticated
export const playClickSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Softer, more refined click sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.03);
    
    // Filter for smoothness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    
    // Very gentle volume - barely noticeable but satisfying
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.04);
  } catch (error) {
    console.log('Sound playback not supported:', error);
  }
};

// Add to cart sound - Delightful and premium
export const playAddToCartSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    // Cheerful upward progression
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.08); // G5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    osc2.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.08); // E5
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);
    
    // Smooth and pleasant envelope
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    osc1.start(audioContext.currentTime);
    osc2.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.15);
    osc2.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.log('Sound playback not supported:', error);
  }
};
