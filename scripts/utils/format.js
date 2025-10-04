/**
 * Number formatting utilities for DodecaDragons
 * Pure functions for formatting Decimal.js numbers into human-readable strings
 */

/**
 * Format a Decimal number into a human-readable string
 * Taken from RedShark77's games and adapted
 *
 * @param {Decimal|number|string} ex - The number to format
 * @param {number} acc - Decimal accuracy (default: 2)
 * @param {number} max - Maximum exponent before scientific notation (default: 9)
 * @returns {string} Formatted number string
 */
function format(ex, acc = 2, max = 9) {
  function E(x) { return new Decimal(x) }
  ex = E(ex)
  const neg = ex.lt(0) ? "-" : ""

  if (ex.mag == Infinity) return neg + 'Infinity'
  if (Number.isNaN(ex.mag)) return neg + 'NaN'

  // Rounds the mag if it's extremely close to an integer due to rounding errors during calculations
  if (ex.layer > 0 && (ex.mag % 1) > 0.9999) ex.mag = Math.ceil(ex.mag)

  if (ex.lt(0)) ex = ex.mul(-1)
  if (ex.eq(0)) return ex.toFixed(acc)

  let e = ex.log10().floor()

  if (ex.log10().lt(Math.min(-acc, 0)) && acc > 1) {
    let e = ex.log10().ceil()
    let m = ex.div(e.eq(-1) ? E(0.1) : E(10).pow(e))
    let be = e.mul(-1).max(1).log10().gte(9)
    return neg + (be ? '' : m.toFixed(2)) + 'e' + format(e, 0, max)
  }
  else if (e.lt(max)) {
    let a = Math.max(Math.min(acc - e.toNumber(), acc), 0)
    return neg + (a > 0 ? ex.toFixed(a) : ex.toFixed(a).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  else {
    if (ex.gte("eeee10")) {
      let slog = ex.slog()
      return (slog.gte(1e9) ? '' : E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + format(slog.floor(), 0)
    }
    let m = ex.div(E(10).pow(e))
    let be = e.gte(10000)
    return neg + (be ? '' : m.toFixed(2)) + 'e' + format(e, 0, max)
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.formatUtils = {
    format
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { format }
}
