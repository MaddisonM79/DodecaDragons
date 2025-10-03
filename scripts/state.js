// Simple global event emitter and minimal UI state store
(function() {
  const listeners = {};

  function on(event, cb) {
    if (!listeners[event]) listeners[event] = new Set();
    listeners[event].add(cb);
    return () => off(event, cb);
  }

  function off(event, cb) {
    if (!listeners[event]) return;
    listeners[event].delete(cb);
  }

  function emit(event, data) {
    if (!listeners[event]) return;
    for (const cb of listeners[event]) {
      try { cb(data); } catch (e) { /* ignore */ }
    }
  }

  window.events = { on, off, emit };

  const uiState = { alertsHtml: "" };

  window.ui = {
    state: uiState,
    setAlert(html) {
      if (uiState.alertsHtml === html) return;
      uiState.alertsHtml = html;
      emit('ui:alerts', html);
    }
  };
})();

