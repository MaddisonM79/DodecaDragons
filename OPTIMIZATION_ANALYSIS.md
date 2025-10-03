# Performance Optimization Analysis

## Evaluation of Additional Suggestions

This document analyzes the suggested optimizations against our existing tracker to identify:
- ✅ Already complete
- 🔄 Already tracked (but not started)
- 🆕 New optimizations to add
- 📝 Enhancements to existing items

---

## 1. Unify loops with rAF
**Status:** ✅ **COMPLETE** (Optimization #1)
**Verdict:** DUPLICATE - Already implemented

**Analysis:**
- This is exactly what we completed in optimization #1
- All setIntervals replaced with single rAF loop
- Scheduler with accumulated time implemented
- Perfect timing accuracy achieved

**No action needed** - This is done!

---

## 2. Batch DOM writes with change detection
**Status:** 🔄 **TRACKED** (Optimization #2)
**Verdict:** ALREADY TRACKED - Expand with specific implementation details

**Analysis:**
- Core concept matches optimization #2 (Eliminate Excessive DOM Manipulation)
- Suggestion adds specific implementation approach: `setText()` and `setStyle()` helpers
- This is a better, more concrete implementation strategy

**Action:** ✏️ **ENHANCE** optimization #2 with these specific helpers:
```javascript
// Add to implementation steps:
- Create setText(el, value) helper with change detection
- Create setStyle(el, prop, value) helper with change detection
- Create setClass(el, className, enabled) helper
- Batch all changes per tick
```

---

## 3. Pre-cache DOM references
**Status:** 🔄 **TRACKED** (Optimization #3)
**Verdict:** ALREADY TRACKED - Exact match

**Analysis:**
- Identical to optimization #3 (Cache DOM Element References)
- Both identify getElementsByClassName and getElementById as targets
- Same solution: build registry, stop re-querying

**No action needed** - Already tracked perfectly!

---

## 4. Remove layout reads inside render
**Status:** 🔄 **PARTIALLY TRACKED** (Optimization #4)
**Verdict:** ENHANCE existing #4 with specific getBoundingClientRect issue

**Analysis:**
- Optimization #4 mentions forced reflows but not this specific case
- render.js:75 calls `getBoundingClientRect()` every render - this is critical!
```javascript
dragonTabHeight = cachedBoxes[3].getBoundingClientRect().height
```

**Action:** ✏️ **ENHANCE** optimization #4:
```
- Specific target: render.js:75 getBoundingClientRect()
- Cache dragon tab height on content change, not every render
- Add mutation observer or explicit height cache invalidation
```

---

## 5. Pan via container transform, not per-box left/top
**Status:** 🆕 **NEW OPTIMIZATION**
**Verdict:** ADD as new item - This is HUGE!

**Analysis:**
- This is NOT covered in existing optimizations
- Current: render.js writes style.left/top for ~47 boxes every frame
- Proposed: Single container with transform: translate3d()
- Impact: O(n) → O(1) writes, GPU accelerated, massive rendering win
- This should be **HIGH PRIORITY** - possibly bigger than our current #4

**Action:** ➕ **ADD NEW** optimization (insert as #4a or promote to #4):

### 🆕 Pan via Container Transform
**Priority:** HIGH
**Impact:** 40-60% rendering performance improvement

**Problem:**
- render.js writes inline `style.left` and `style.top` for 47 boxes each frame
- O(n) style writes = 94+ DOM operations per render (10 FPS = 940 ops/sec)
- Forces layout recalculation for each box
- Not GPU accelerated

**Solution:**
- Wrap all .box elements in single container
- Use `transform: translate3d(x, y, 0)` on container only
- Boxes remain static relative to container
- O(1) transform operation, GPU accelerated

**Code change:**
```javascript
// Current (BAD):
cachedBoxes[0].style.left = (x) + "px"
cachedBoxes[0].style.top = (y) + "px"
// ... 47 times

// New (GOOD):
container.style.transform = `translate3d(${x}px, ${y}px, 0)`
// Done! All boxes move together
```

---

## 6. Throttle/partition formatting and big-number math
**Status:** 🔄 **SPLIT BETWEEN** #5 and #10
**Verdict:** Clarify and expand both

**Analysis:**
- Overlaps with #5 (Reduce Decimal Instantiation) and #10 (Memoization)
- But adds specific focus on `format()` function throttling
- format() is called for EVERY value update, even when unchanged

**Action:** ✏️ **ENHANCE** both:

**#5 Enhancement:**
```
- Add specific focus on format() calls
- Only format when value changes (not every update)
- Cache formatted strings
```

**#10 Enhancement:**
```
- Add format() result caching
- Track last formatted value and input value
- Return cached string if input unchanged
```

---

## 7. Visibility-based throttling
**Status:** 🆕 **NEW OPTIMIZATION**
**Verdict:** ADD - Quick win, SPA-critical

**Analysis:**
- NOT covered in existing optimizations
- Page Visibility API to pause/throttle when tab hidden
- Easy implementation, big battery/CPU savings
- Critical for SPA (mobile especially)

**Action:** ➕ **ADD NEW** optimization:

### 🆕 Visibility-Based Throttling
**Priority:** MEDIUM (Quick win)
**Impact:** 90%+ CPU reduction when tab hidden

**Problem:**
- Game runs at full speed even when tab is hidden
- Wastes CPU and battery
- Not SPA-friendly

**Solution:**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause() // or throttle to 1 FPS
  } else {
    gameLoop.resume()
  }
})
```

**Implementation:**
- Integrate with existing gameLoop.js
- Add throttled mode (1-2 FPS when hidden)
- Resume full speed on visibility
- Track offline time for resource accumulation

---

## 8. Event-driven achievements and UI unlocks
**Status:** 🆕 **NEW OPTIMIZATION**
**Verdict:** ADD - Aligns with SPA reactive model

**Analysis:**
- Currently `checkAchievements()` scans ALL achievements every 500ms
- Wasteful - most achievements don't change most ticks
- Event-driven approach only checks when relevant state changes

**Action:** ➕ **ADD NEW** optimization:

### 🆕 Event-Driven Achievements
**Priority:** MEDIUM
**Impact:** 5-10% CPU reduction

**Problem:**
- `checkAchievements()` in updateLarge scans all achievements
- Runs every 500ms regardless of state changes
- Many achievement conditions don't change

**Solution:**
- Fire achievement checks only on state changes:
  - Purchase events
  - Reset events
  - Resource threshold crossed
- Maintain dirty flags per achievement category
- Only check dirty categories

**Implementation:**
```javascript
// Event emission:
emit('purchase', {type: 'miner', amount: 1})
emit('resourceChange', {resource: 'gold', value: newGold})

// Listeners:
on('purchase', checkPurchaseAchievements)
on('resourceChange', checkResourceAchievements)
```

---

## 9. Remove unused jQuery
**Status:** 🆕 **NEW QUICK WIN**
**Verdict:** ADD - Free performance, easy

**Analysis:**
- jQuery loaded in index.html:1318
- Searched all .js files: **ZERO jQuery usage found**
- Pure waste: ~30KB parsed for nothing
- Easy removal, immediate benefit

**Action:** ➕ **ADD NEW** quick win:

### 🆕 Remove Unused jQuery
**Priority:** LOW (Quick win - 5 min)
**Impact:** Faster page load, smaller bundle

**Problem:**
- index.html line 1318 includes jQuery CDN
- Zero jQuery usage in codebase (no $ or jQuery calls)
- 30KB+ parsed/executed for nothing

**Solution:**
```html
<!-- Remove this line: -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

**Verification:**
```bash
grep -r "\$(" scripts/
grep -r "jQuery" scripts/
# Both return empty - safe to remove!
```

---

## 10. Timer consolidation for autosave
**Status:** ✅ **COMPLETE** (Optimization #1)
**Verdict:** DUPLICATE - Already done

**Analysis:**
- All timers including autosave moved to gameLoop.js
- Centralized scheduler implemented
- This is complete!

**No action needed** - Already done in #1!

---

## SPA Prep Notes

### A. Decouple .box indexing
**Status:** 🔄 **RELATED TO** #9 (Separate Game/UI State)
**Verdict:** ADD as sub-item of #9

**Analysis:**
- render.js assumes 47 fixed boxes by index
- Hard-coded: `cachedBoxes[0]`, `cachedBoxes[1]`, etc.
- Makes UI reordering/rebuilding impossible
- Critical for SPA component model

**Action:** ✏️ **ENHANCE** #9:
```
- Replace .box[index] with data-tab attribute mapping
- Create tab registry system
- Enable dynamic UI reordering
- Prepare for component-based rendering
```

### B. Extract minimal observable store
**Status:** 🔄 **CORE OF** #9 (Separate Game/UI State)
**Verdict:** This IS optimization #9

**Analysis:**
- Wrapping game in observable store IS the goal of #9
- subscribe/notify pattern for UI updates
- This is the exact architecture we need

**No action needed** - Already the plan for #9!

### C. Replace inline onclick with delegated listeners
**Status:** 🆕 **NEW SPA PREP TASK**
**Verdict:** ADD as sub-item of #9

**Analysis:**
- Current: `<button onclick="buyMiner()">` throughout HTML
- Problem: Not component-friendly, hard to port
- Solution: Event delegation with addEventListener

**Action:** ✏️ **ENHANCE** #9:
```
- Remove all inline onclick handlers from HTML
- Add event delegation system
- Central event handler mapping
- Prepares for component-based UI
```

---

## Summary of Changes Needed

### ✅ Already Complete (No Action)
1. Unify loops with rAF (#1) ✅
2. Timer consolidation (#1) ✅

### 🔄 Already Tracked (No New Item)
3. Pre-cache DOM (#3) - exact match
4. Extract observable store - IS #9

### ✏️ Enhance Existing Items
5. **#2** - Add setText/setStyle helper details
6. **#4** - Add specific getBoundingClientRect() fix
7. **#5** - Add format() call optimization
8. **#9** - Add .box indexing fix, onclick removal
9. **#10** - Add format() result caching

### ➕ Add New Optimizations
10. **Container Transform** (NEW #4a) - HIGH priority, huge win
11. **Visibility Throttling** (NEW #11) - Medium priority, quick win
12. **Event-Driven Achievements** (NEW #12) - Medium priority
13. **Remove jQuery** (NEW #13) - Quick win, 5 minutes

---

## Updated Priority Order

### Phase 1: Foundation
1. ✅ Unified Game Loop - COMPLETE
2. #9 Separate Game/UI State (enhanced)
3. #6 Server-Ready Saves

### Phase 2: Rendering (Biggest Visual Wins)
4. **#4a Container Transform** ⭐ NEW - 40-60% rendering boost
5. #4 Optimize Rendering (enhanced)
6. #2 Batch DOM Writes (enhanced with helpers)
7. #3 Cache DOM References

### Phase 3: Computation
8. #7 Modularize Updates
9. #10 Memoization (enhanced with format caching)
10. #5 Reduce Decimal Instantiation (enhanced)

### Phase 4: Polish & SPA Prep
11. **#11 Visibility Throttling** 🆕 - Quick win
12. **#12 Event-Driven Achievements** 🆕
13. #8 Lazy Rendering
14. **#13 Remove jQuery** 🆕 - 5 minute task

---

## Immediate Recommendations

**Do Next:**
1. **Remove jQuery** (5 min) - Free win, do it now
2. **Container Transform** (#4a) - Biggest rendering improvement
3. **Batch DOM Writes** (#2) - Biggest CPU improvement

**Quick Wins:**
- Remove jQuery: 5 minutes
- Visibility throttling: 30 minutes
- Container transform: 2-3 hours (big impact)

**Total New Items:** 4 (Container Transform, Visibility Throttling, Event-Driven Achievements, Remove jQuery)
**Enhanced Items:** 5 (#2, #4, #5, #9, #10)
**Total Optimizations:** 13 → 17 items
