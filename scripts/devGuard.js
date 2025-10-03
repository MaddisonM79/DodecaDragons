// Dev-only guard: warn on direct DOM access from logic modules
(function() {
  if (!window.isDevVersion) return;
  const allowed = [
    'scripts/ui.js',
    'scripts/state.js',
    'scripts/render.js'
  ];

  function shouldWarn(stack) {
    if (!stack) return false;
    const lines = String(stack).split('\n');
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const line = lines[i];
      if (line.indexOf('scripts/') !== -1) {
        const ok = allowed.some(a => line.indexOf(a) !== -1);
        if (!ok) return true;
      }
    }
    return false;
  }

  function wrap(obj, name) {
    const orig = obj[name];
    if (typeof orig !== 'function') return;
    obj[name] = function() {
      const stack = (new Error()).stack;
      if (shouldWarn(stack)) {
        const caller = (String(stack).split('\n')[2] || '').trim();
        console.warn(`[DEV GUARD] Direct DOM access via ${name} at ${caller}`);
      }
      return orig.apply(this, arguments);
    };
  }

  wrap(document, 'getElementById');
  wrap(document, 'getElementsByClassName');
  wrap(document, 'querySelector');
  wrap(document, 'querySelectorAll');
})();

