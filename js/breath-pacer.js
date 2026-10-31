/**
 * MindMirror - Interactive Breath Pacer
 * Uses requestAnimationFrame and Web Audio API (synthesized chime) for calming breathwork.
 */

class BreathPacer {
  constructor(canvasId, instructionId, timerId, cycleCountId) {
    this.canvas = document.getElementById(canvasId);
    this.instructionEl = document.getElementById(instructionId);
    this.timerEl = document.getElementById(timerId);
    this.cycleCountEl = document.getElementById(cycleCountId);
    
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.isRunning = false;
    this.mode = 'box'; // 'box', '478', 'sigh'
    this.soundEnabled = false;

    // Pattern definitions in milliseconds
    this.patterns = {
      box: [
        { label: 'Inhale slowly through nose', duration: 4000, action: 'inhale' },
        { label: 'Hold breath gently', duration: 4000, action: 'hold' },
        { label: 'Exhale smoothly through mouth', duration: 4000, action: 'exhale' },
        { label: 'Hold empty and still', duration: 4000, action: 'holdEmpty' }
      ],
      '478': [
        { label: 'Inhale deeply through nose', duration: 4000, action: 'inhale' },
        { label: 'Hold breath peacefully', duration: 7000, action: 'hold' },
        { label: 'Long, soothing whoosh exhale', duration: 8000, action: 'exhale' }
      ],
      sigh: [
        { label: 'Deep inhale through nose', duration: 2500, action: 'inhale' },
        { label: 'Quick top-off second sniff', duration: 1200, action: 'sniff' },
        { label: 'Long, releasing audible sigh', duration: 6000, action: 'exhale' }
      ]
    };

    this.currentStepIndex = 0;
    this.stepStartTime = 0;
    this.totalSeconds = 0;
    this.completedCycles = 0;
    this.animationFrame = null;
    this.timerInterval = null;
    this.audioCtx = null;

    if (this.canvas) {
      this.initCanvasSize();
      this.drawPacer(0.4, 'rgba(99, 102, 241, 0.4)', 'Ready');
    }
  }

  initCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 260, 260);
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
    this.size = size;
  }

  initAudio() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  }

  playGentleTone(frequency = 432, type = 'sine', duration = 1.2) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      // Smooth subtle fade-in and exponential decay
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback not supported or blocked:', e);
    }
  }

  setMode(mode) {
    if (this.patterns[mode]) {
      this.mode = mode;
      if (this.isRunning) {
        this.currentStepIndex = 0;
        this.stepStartTime = performance.now();
      }
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    if (this.soundEnabled) {
      this.initAudio();
      this.playGentleTone(528, 'sine', 0.8);
    }
    return this.soundEnabled;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentStepIndex = 0;
    this.stepStartTime = performance.now();
    this.totalSeconds = 0;
    this.completedCycles = 0;

    if (this.timerEl) this.timerEl.textContent = '00:00';
    if (this.cycleCountEl) this.cycleCountEl.textContent = '0';

    this.timerInterval = setInterval(() => {
      this.totalSeconds++;
      const mins = String(Math.floor(this.totalSeconds / 60)).padStart(2, '0');
      const secs = String(this.totalSeconds % 60).padStart(2, '0');
      if (this.timerEl) this.timerEl.textContent = `${mins}:${secs}`;
    }, 1000);

    this.playGentleTone(432, 'sine', 1.0);
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.instructionEl) {
      this.instructionEl.textContent = 'Session paused. Take a gentle breath.';
    }
    this.drawPacer(0.4, 'rgba(99, 102, 241, 0.3)', 'Paused');
  }

  reset() {
    this.stop();
    this.totalSeconds = 0;
    this.completedCycles = 0;
    this.currentStepIndex = 0;
    if (this.timerEl) this.timerEl.textContent = '00:00';
    if (this.cycleCountEl) this.cycleCountEl.textContent = '0';
    if (this.instructionEl) this.instructionEl.textContent = 'Click "Begin Breathing" to calm your nervous system';
    this.drawPacer(0.4, 'rgba(99, 102, 241, 0.4)', 'Ready');
  }

  loop() {
    if (!this.isRunning) return;

    const currentPattern = this.patterns[this.mode];
    const currentStep = currentPattern[this.currentStepIndex];
    const now = performance.now();
    const elapsed = now - this.stepStartTime;
    const progress = Math.min(elapsed / currentStep.duration, 1.0);

    // Calculate scale and colors based on action
    let scale = 0.4;
    let label = currentStep.label;
    let color = 'rgba(99, 102, 241, 0.7)';

    if (currentStep.action === 'inhale') {
      scale = 0.4 + 0.5 * this.easeInOutCubic(progress);
      color = 'rgba(99, 102, 241, 0.85)';
    } else if (currentStep.action === 'sniff') {
      scale = 0.85 + 0.1 * this.easeInOutCubic(progress);
      color = 'rgba(129, 140, 248, 0.9)';
    } else if (currentStep.action === 'hold') {
      scale = 0.9 + 0.03 * Math.sin(progress * Math.PI * 2);
      color = 'rgba(16, 185, 129, 0.85)';
    } else if (currentStep.action === 'exhale') {
      scale = 0.9 - 0.5 * this.easeInOutCubic(progress);
      color = 'rgba(14, 165, 233, 0.85)';
    } else if (currentStep.action === 'holdEmpty') {
      scale = 0.4 + 0.02 * Math.sin(progress * Math.PI * 2);
      color = 'rgba(168, 85, 247, 0.85)';
    }

    const remainingSecs = Math.max(1, Math.ceil((currentStep.duration - elapsed) / 1000));
    if (this.instructionEl) {
      this.instructionEl.innerHTML = `<strong>${label}</strong> <span class="countdown-badge">${remainingSecs}s</span>`;
    }

    this.drawPacer(scale, color, remainingSecs);

    if (elapsed >= currentStep.duration) {
      // Step complete, advance
      this.currentStepIndex = (this.currentStepIndex + 1) % currentPattern.length;
      this.stepStartTime = performance.now();

      if (this.currentStepIndex === 0) {
        this.completedCycles++;
        if (this.cycleCountEl) this.cycleCountEl.textContent = this.completedCycles;
        this.playGentleTone(528, 'sine', 1.2);
      } else {
        const nextStep = currentPattern[this.currentStepIndex];
        const toneFreq = nextStep.action === 'exhale' ? 396 : 432;
        this.playGentleTone(toneFreq, 'sine', 0.8);
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  drawPacer(scaleRatio, color, text) {
    if (!this.ctx) return;
    const size = this.size;
    const center = size / 2;
    const baseRadius = size * 0.44;
    const currentRadius = baseRadius * scaleRatio;

    this.ctx.clearRect(0, 0, size, size);

    // Draw outer guide boundary ring
    this.ctx.beginPath();
    this.ctx.arc(center, center, baseRadius * 0.92, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 6]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Outer subtle ambient glow
    const gradGlow = this.ctx.createRadialGradient(center, center, currentRadius * 0.5, center, center, currentRadius * 1.3);
    gradGlow.addColorStop(0, color);
    gradGlow.addColorStop(0.7, color.replace('0.85', '0.2').replace('0.9', '0.25').replace('0.7', '0.2'));
    gradGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.beginPath();
    this.ctx.arc(center, center, currentRadius * 1.25, 0, Math.PI * 2);
    this.ctx.fillStyle = gradGlow;
    this.ctx.fill();

    // Central pulsing breathing bubble
    const gradCircle = this.ctx.createRadialGradient(center - currentRadius * 0.25, center - currentRadius * 0.25, 2, center, center, currentRadius);
    gradCircle.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradCircle.addColorStop(0.4, color);
    gradCircle.addColorStop(1, color.replace('0.85', '0.6').replace('0.9', '0.65').replace('0.7', '0.5'));

    this.ctx.beginPath();
    this.ctx.arc(center, center, currentRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = gradCircle;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 15;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Center text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    if (this.isRunning && typeof text === 'number') {
      this.ctx.fillText(`${text}s`, center, center);
    } else {
      this.ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      this.ctx.fillText(String(text), center, center);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BreathPacer };
}
