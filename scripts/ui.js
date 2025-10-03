// Minimal UI helpers with change detection
(function() {
  if (!window.events) return;

  const textCache = new Map();
  const htmlCache = new Map();
  const disabledCache = new Map();

  if (!window.ui) window.ui = {};
  window.ui.update = {
    setText(id, value) {
      const el = document.getElementById(id);
      if (!el) return;
      const key = `#${id}`;
      if (textCache.get(key) === value) return;
      textCache.set(key, value);
      el.textContent = value;
    },
    setHTML(id, html) {
      const el = document.getElementById(id);
      if (!el) return;
      const key = `#${id}`;
      if (htmlCache.get(key) === html) return;
      htmlCache.set(key, html);
      el.innerHTML = html;
    },
    setDisabled(id, disabled) {
      const el = document.getElementById(id);
      if (!el) return;
      const key = `#${id}`;
      if (disabledCache.get(key) === !!disabled) return;
      disabledCache.set(key, !!disabled);
      el.disabled = !!disabled;
    },
    showResourceRow(index) {
      const rows = document.getElementsByClassName('resourceRow');
      if (!rows || !rows[index]) return;
      if (rows[index].style.display !== 'block') rows[index].style.display = 'block';
    }
  };

  // Alerts subscriber
  events.on('ui:alerts', (html) => {
    const el = document.getElementById('alerts');
    if (el && el.innerHTML !== html) el.innerHTML = html;
  });

  // --- Sweep 2: delegated click actions ---
  function parseArgs(attr) {
    if (!attr) return [];
    const s = String(attr).trim();
    try {
      if (s.startsWith('[') || s.startsWith('{')) {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch(_) {}
    return s.split(',').map(v => {
      const t = v.trim();
      if (t === 'true') return true;
      if (t === 'false') return false;
      if (t === 'null') return null;
      if (t !== '' && !isNaN(t)) return Number(t);
      return t;
    });
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    const args = parseArgs(target.getAttribute('data-args'));
    const fn = action && window[action];
    if (typeof fn === 'function') {
      e.preventDefault();
      try { fn.apply(window, args); } catch(_) {}
    }
  });
})();
