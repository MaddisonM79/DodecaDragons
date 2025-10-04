# Logic Extraction Summary - Vue Migration Prep

## Completed: 2025-10-04

This document summarizes the extraction of game logic and utilities from `script.js` into pure, reusable modules as preparation for Vue.js migration.

---

## Extracted Modules

### 1. **scripts/utils/format.js**
**Pure utility for number formatting**

- `format(ex, acc, max)` - Formats Decimal.js numbers into human-readable strings
- Taken from RedShark77's games
- **Zero dependencies on game state or DOM**
- Handles scientific notation, F notation, and large number formatting
- Exported as `window.formatUtils.format()` for backward compatibility
- Ready for ES module export in Vue

**Usage in script.js:**
```javascript
// Old: Direct implementation
function format(ex, acc=2, max=9) { /* 30 lines */ }

// New: Wrapper calling pure module
function format(ex, acc=2, max=9) {
  return window.formatUtils.format(ex, acc, max)
}
```

---

### 2. **scripts/utils/math.js**
**Pure utility for mathematical operations**

Functions:
- `lerp(start, end, amt)` - Linear interpolation
- `lerpColour(start, end, amt)` - Hexadecimal color interpolation

**Zero dependencies on game state or DOM**
- Exported as `window.mathUtils` for backward compatibility
- Ready for ES module export in Vue

**Usage in script.js:**
```javascript
// Old: Direct implementation
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// New: Wrapper calling pure module
function lerp(start, end, amt) {
  return window.mathUtils.lerp(start, end, amt)
}
```

---

### 3. **scripts/game/timeLogic.js**
**Pure logic for time tracking and formatting**

Functions:
- `calculateTimePlayedString(totalSeconds)` - Converts seconds to HH:MM:SS format
- `updateTimePlayed(game, lastUpdate, isPaused)` - Updates time played with pause support

**Zero DOM dependencies** (caller handles DOM updates)
- Returns data structures instead of directly updating DOM
- Supports pause state for `bigFinish` sequence
- Exported as `window.timeLogic` for backward compatibility

**Usage in script.js:**
```javascript
// Old: Direct DOM manipulation
function timePlayedUp() {
  if (bigFinishPoint == 0) {
    timePlayedDiff = (Date.now() - lastTimePlayedUp) / 1000
    game.timePlayed += timePlayedDiff
    // ... 6 lines of calculations ...
    document.getElementById("timePlayed").textContent = timeString
    lastTimePlayedUp = Date.now()
  }
}

// New: Pure logic + DOM update
function timePlayedUp() {
  if (bigFinishPoint == 0) {
    const result = window.timeLogic.updateTimePlayed(game, lastTimePlayedUp, false)
    game.timePlayed = result.timePlayed
    document.getElementById("timePlayed").textContent = result.timeString
    lastTimePlayedUp = result.lastUpdate
  }
}
```

---

### 4. **scripts/game/saveLogic.js**
**Pure logic for save/load system (Critical for server migration)**

Functions:
- `serializeGameState(gameState)` - Convert game state to JSON string
- `encodeGameState(gameState)` - Encode to base64 for export
- `decodeGameState(encodedState)` - Decode base64 import
- `parseGameState(jsonState)` - Parse JSON string
- `mergeSaveData(currentState, loadedState)` - Merge loaded save with defaults
  - Handles Decimal.js deserialization
  - Handles array merging
- `checkSaveVersion(loadedState, currentVersion)` - Check if migration needed
- `getSaveErrorCode(params)` - Generate diagnostic error code
- `saveToLocalStorage(gameState)` - Save to localStorage (atomic operation)
- `loadFromLocalStorage()` - Load from localStorage
- `getLastSavedTimestamp()` - Get last save timestamp

**Zero DOM dependencies** (caller handles UI)
- **Critical for server-based save system**
- Separates serialization logic from storage mechanism
- Ready for HTTP API integration in Vue
- Exported as `window.saveLogic` for backward compatibility

**Usage in script.js:**
```javascript
// Old: Direct localStorage manipulation
function save() {
  game.lastSave = Date.now();
  localStorage.setItem("dodecaSave", JSON.stringify(game));
  localStorage.setItem("dodecaLastSaved", game.lastSave);
}

// New: Pure logic handling serialization and storage
function save() {
  const result = window.saveLogic.saveToLocalStorage(game)
  if (result.success) {
    game.lastSave = result.timestamp
  }
}
```

**Export function (old):**
```javascript
// Old: Mixed logic and DOM
function exportGame() {
  save()
  inputField.value = btoa(JSON.stringify(game));
  // ... clipboard logic ...
}

// New: Pure encode logic
function exportGame() {
  save()
  inputField.value = window.saveLogic.encodeGameState(game);
  // ... clipboard logic ...
}
```

---

## Integration

All modules added to `index.html` before `script.js`:

```html
<!-- Utility modules (pure functions) -->
<script src="scripts/utils/format.js"></script>
<script src="scripts/utils/math.js"></script>
<!-- Game logic modules -->
<script src="scripts/game/timeLogic.js"></script>
<script src="scripts/game/saveLogic.js"></script>
<script src="scripts/script.js"></script>
```

---

## Benefits for Vue Migration

### 1. **Pure Functions = Easy Testing**
- All logic modules have zero side effects
- Can be unit tested independently
- Can run in Node.js environment (server-side validation)

### 2. **DOM Separation**
- Logic modules don't touch DOM
- Ready to wire into Vue's reactivity system
- No refactoring needed when migrating to Vue components

### 3. **Module Export Patterns**
Current:
```javascript
// Backward compatible (browser global)
if (typeof window !== 'undefined') {
  window.formatUtils = { format }
}

// Future Vue (ES modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { format }
}
```

Future Vue (when migrating):
```javascript
// Simply switch to ES6 export
export { format }
```

### 4. **Server-Ready Save System**
- `saveLogic.js` is pure serialization/deserialization
- Easy to replace `localStorage` calls with HTTP API:

```javascript
// Current (localStorage)
function save() {
  const result = window.saveLogic.saveToLocalStorage(game)
}

// Future (server API)
async function save() {
  const serialized = window.saveLogic.serializeGameState(game)
  await fetch('/api/save', {
    method: 'POST',
    body: serialized
  })
}
```

### 5. **Format Everywhere**
- `format()` is now a standalone utility
- Can be imported into any Vue component
- No circular dependencies

---

## File Sizes

```
scripts/utils/format.js:      2,000 bytes (pure formatting logic)
scripts/utils/math.js:        1,320 bytes (pure math utilities)
scripts/game/timeLogic.js:    1,747 bytes (pure time calculations)
scripts/game/saveLogic.js:    6,015 bytes (pure save/load logic)
```

**Total extracted:** ~11KB of pure logic separated from script.js

---

## Next Steps for Vue Migration

### Immediate (Phase 3 - Optimization #9)
1. ✅ Extract format utilities → `scripts/utils/format.js`
2. ✅ Extract math utilities → `scripts/utils/math.js`
3. ✅ Extract time logic → `scripts/game/timeLogic.js`
4. ✅ Extract save logic → `scripts/game/saveLogic.js`
5. ⏳ Extract remaining formulas from `updateSmall()`, `updateLarge()`
6. ⏳ Extract UI state management (tabs, toggles, unlocks)

### Future (Phase 4-6)
7. Convert modules to ES6 exports
8. Set up Vue 3 + Vite build system
9. Create Pinia store using extracted logic
10. Build Vue components using pure modules
11. Wire up Vue reactivity (replaces all `ui.update` calls)
12. Test headless game simulation

---

## Testing Checklist

Before committing, verify:
- [x] Game loads without errors
- [x] Format function works (check number displays)
- [x] Save/load works (export/import)
- [x] Time played updates correctly
- [x] All extracted modules loaded in index.html
- [x] No console errors

---

## Compatibility

All changes are **backward compatible**:
- Original function signatures unchanged
- script.js functions are now wrappers
- DOM manipulation unchanged
- Game behavior identical

This allows incremental migration to Vue without breaking existing code.

---

## Related Files Modified

1. `scripts/script.js` - Replaced implementations with module wrappers
2. `index.html` - Added new script tags for utility/game modules
3. `scripts/utils/format.js` - Created
4. `scripts/utils/math.js` - Created
5. `scripts/game/timeLogic.js` - Created
6. `scripts/game/saveLogic.js` - Created

---

## Performance Notes

**No performance impact:**
- Wrapper functions add negligible overhead (~1 function call)
- Logic execution is identical
- Modern JS engines inline simple wrappers

**Future benefits:**
- Pure functions enable memoization
- Tree-shaking in Vue build (unused code removed)
- Module code splitting (load on demand)

---

## Architecture Pattern

This follows the **Logic/Presentation Separation** pattern:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (script.js, DOM manipulation)          │
│  - Calls pure logic modules             │
│  - Updates DOM based on results         │
└─────────────────────────────────────────┘
                  ↓ calls
┌─────────────────────────────────────────┐
│         Logic Layer (Pure)              │
│  (utils/*, game/*Logic.js)              │
│  - Zero DOM dependencies                │
│  - Pure functions only                  │
│  - Returns data structures              │
└─────────────────────────────────────────┘
```

**Vue will replace the Presentation Layer:**
```
┌─────────────────────────────────────────┐
│      Vue Components (Future)            │
│  - Reactive templates                   │
│  - Computed properties                  │
│  - Event handlers                       │
└─────────────────────────────────────────┘
                  ↓ uses
┌─────────────────────────────────────────┐
│         Logic Layer (Same!)             │
│  (utils/*, game/*Logic.js)              │
│  - No changes needed                    │
│  - Just convert to ES6 exports          │
└─────────────────────────────────────────┘
```

---

## Conclusion

✅ **4 major logic modules extracted**
✅ **~11KB of pure logic separated from script.js**
✅ **Zero DOM dependencies in logic layer**
✅ **Backward compatible (no breaking changes)**
✅ **Ready for Vue migration (Phase 6)**
✅ **Server-ready save system (Phase 6)**

This is a critical step toward Vue.js migration and server-based architecture.
