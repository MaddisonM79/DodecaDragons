// Unified Game Loop System
// Replaces multiple setInterval timers with a single requestAnimationFrame loop

var gameLoop = {
  // Timing accumulators
  lastFrameTime: 0,
  updateSmallAccumulator: 0,
  updateLargeAccumulator: 0,
  renderAutoAccumulator: 0,
  renderKeyboardAccumulator: 0,
  saveAccumulator: 0,
  timePlayedAccumulator: 0,
  fpsCounterAccumulator: 0,

  // Timing intervals (in milliseconds)
  updateSmallInterval: 150,
  updateLargeInterval: 500,
  renderAutoInterval: 100,
  renderKeyboardInterval: 1000 / 72, // ~13.89ms for 72fps
  saveInterval: 5000,
  timePlayedInterval: 100,
  fpsCounterInterval: 200,

  // Control flags
  running: false,
  animationFrameId: null,

  // Initialize the game loop
  init: function() {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  },

  // Main game loop
  loop: function(currentTime) {
    if (!this.running) return;

    // Calculate delta time since last frame
    var deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Prevent huge delta times (e.g., when tab was inactive)
    if (deltaTime > 1000) deltaTime = 1000;

    // Accumulate time for each system
    this.updateSmallAccumulator += deltaTime;
    this.updateLargeAccumulator += deltaTime;
    this.renderAutoAccumulator += deltaTime;
    this.renderKeyboardAccumulator += deltaTime;
    this.saveAccumulator += deltaTime;
    this.timePlayedAccumulator += deltaTime;
    this.fpsCounterAccumulator += deltaTime;

    // Update small (150ms)
    while (this.updateSmallAccumulator >= this.updateSmallInterval) {
      this.updateSmallAccumulator -= this.updateSmallInterval;
      if (typeof updateSmall === 'function') updateSmall();
    }

    // Update large (500ms)
    while (this.updateLargeAccumulator >= this.updateLargeInterval) {
      this.updateLargeAccumulator -= this.updateLargeInterval;
      if (typeof updateLarge === 'function') updateLarge();
    }

    // Render auto (100ms)
    while (this.renderAutoAccumulator >= this.renderAutoInterval) {
      this.renderAutoAccumulator -= this.renderAutoInterval;
      if (typeof renderAuto === 'function') renderAuto();
    }

    // Render keyboard (72fps ~13.89ms)
    while (this.renderKeyboardAccumulator >= this.renderKeyboardInterval) {
      this.renderKeyboardAccumulator -= this.renderKeyboardInterval;
      if (typeof renderKeyboardPan === 'function') renderKeyboardPan();
    }

    // Auto-save (5000ms)
    while (this.saveAccumulator >= this.saveInterval) {
      this.saveAccumulator -= this.saveInterval;
      if (typeof save === 'function') save();
    }

    // Time played update (100ms)
    while (this.timePlayedAccumulator >= this.timePlayedInterval) {
      this.timePlayedAccumulator -= this.timePlayedInterval;
      if (typeof timePlayedUp === 'function') timePlayedUp();
    }

    // FPS counter (200ms, only in dev mode)
    if (isDevVersion) {
      while (this.fpsCounterAccumulator >= this.fpsCounterInterval) {
        this.fpsCounterAccumulator -= this.fpsCounterInterval;
        if (typeof fps !== 'undefined' && document.getElementById("fps")) {
          document.getElementById("fps").textContent = fps + " fps";
        }
      }
    }

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  },

  // Stop the game loop
  stop: function() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  },

  // Pause/resume the loop
  pause: function() {
    this.running = false;
  },

  resume: function() {
    if (!this.running) {
      this.running = true;
      this.lastFrameTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
  }
};
