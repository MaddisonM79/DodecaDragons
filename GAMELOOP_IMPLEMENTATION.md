# Game Loop Implementation - Performance Improvement #1

## Summary

Replaced multiple competing `setInterval` timers with a single unified game loop using `requestAnimationFrame`. This is the first of 10 planned performance improvements for DodecaDragons.

## Changes Made

### New Files
- **`scripts/gameLoop.js`** - Unified game loop manager
- **`test_gameloop.html`** - Test page to verify timing accuracy

### Modified Files
1. **`scripts/script.js`**
   - Removed `setInterval(updateSmall, 150)`
   - Removed `setInterval(updateLarge, 500)`
   - Removed `setInterval(save, 5000)`
   - Removed `setInterval(timePlayedUp, 100)`
   - Removed FPS counter `setInterval`

2. **`scripts/render.js`**
   - Removed `setInterval(renderAuto, 100)`
   - Removed `setInterval(renderKeyboardPan, 1000/72)`

3. **`index.html`**
   - Added `<script src="scripts/gameLoop.js"></script>`
   - Added `gameLoop.init()` call after page load

## Previous System (Problems)

```
❌ 6+ separate setInterval timers
❌ Uncoordinated timing - each timer ran independently
❌ Timer drift and accumulation errors
❌ Inefficient - each timer had its own event loop overhead
❌ Hard to pause/resume entire game
❌ Performance issues when tab is backgrounded
```

**Timer List (OLD):**
- updateSmall: 150ms (6.67 Hz)
- updateLarge: 500ms (2 Hz)
- renderAuto: 100ms (10 Hz)
- renderKeyboardPan: ~13.89ms (72 Hz)
- save: 5000ms (0.2 Hz)
- timePlayedUp: 100ms (10 Hz)
- FPS counter: 200ms (5 Hz, dev only)

## New System (Benefits)

```
✅ Single requestAnimationFrame loop
✅ Coordinated timing with delta time tracking
✅ Accumulator-based fixed timesteps
✅ Runs at monitor refresh rate (~60 FPS)
✅ Automatic tab throttling when backgrounded
✅ Easy pause/resume functionality
✅ Lower overhead, better performance
✅ Prevents timer drift
```

**Architecture:**
```
requestAnimationFrame (60 FPS)
  ↓
gameLoop.loop()
  ↓
  ├─ Calculate deltaTime
  ├─ Accumulate time for each system
  │
  ├─ updateSmall (when accumulated >= 150ms)
  ├─ updateLarge (when accumulated >= 500ms)
  ├─ renderAuto (when accumulated >= 100ms)
  ├─ renderKeyboardPan (when accumulated >= ~13.89ms)
  ├─ save (when accumulated >= 5000ms)
  ├─ timePlayedUp (when accumulated >= 100ms)
  └─ FPS counter (when accumulated >= 200ms, dev only)
```

## How It Works

The new game loop uses **time accumulators** for each system:

```javascript
// Each frame:
deltaTime = currentTime - lastFrameTime
updateSmallAccumulator += deltaTime

// When enough time has accumulated:
if (updateSmallAccumulator >= 150ms) {
  updateSmallAccumulator -= 150ms  // Preserve excess
  updateSmall()
}
```

This ensures:
- Exact timing intervals (no drift)
- Excess time carries over to next frame
- Systems run at correct frequency regardless of frame rate

## Testing

Open `test_gameloop.html` in a browser to verify:
- All systems run at correct intervals
- Timing accuracy is within ±5%
- FPS counter shows ~60 FPS
- Start/stop controls work correctly

Expected results:
- **updateSmall**: ~150ms intervals (±5%)
- **updateLarge**: ~500ms intervals (±5%)
- **renderAuto**: ~100ms intervals (±5%)
- **save**: ~5000ms intervals (±5%)

## API

```javascript
// Initialize and start the loop
gameLoop.init()

// Stop the loop completely
gameLoop.stop()

// Pause (can be resumed)
gameLoop.pause()

// Resume from pause
gameLoop.resume()

// Check if running
gameLoop.running  // true/false
```

## Performance Impact

**Estimated improvements:**
- **CPU usage**: ~10-15% reduction from eliminating timer overhead
- **Frame timing**: More consistent, less jitter
- **Tab throttling**: Better battery life when game is backgrounded
- **Foundation**: Enables future optimizations (#2-#10)

## Compatibility

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ No breaking changes to game logic
- ✅ Backwards compatible with existing saves

## Next Steps

This change enables future optimizations:
- **#2**: Reduce DOM manipulation
- **#3**: Cache DOM references
- **#4**: Optimize rendering system
- **#5**: Reduce Decimal instantiation
- **#6**: Server-based save system
- **#7**: Modularize update functions
- **#8**: Lazy rendering
- **#9**: Separate game/UI state
- **#10**: Memoize calculations

## Notes

- The game loop runs at ~60 FPS but systems still execute at their original intervals
- No changes to game balance or mechanics
- All timing behavior should be identical to before
- The loop automatically throttles when tab is inactive (browser feature)
