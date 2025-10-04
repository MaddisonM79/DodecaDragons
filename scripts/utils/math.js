/**
 * Math utility functions for DodecaDragons
 * Pure functions for common mathematical operations
 */

/**
 * Linear interpolation between two values
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} amt - Amount to interpolate (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

/**
 * Linear interpolation between two hexadecimal colors
 * @param {string} start - Starting color in hex format (without #)
 * @param {string} end - Ending color in hex format (without #)
 * @param {number} amt - Amount to interpolate (0-1)
 * @returns {string} Interpolated color in hex format
 */
function lerpColour(start, end, amt) {
  let startInt = parseInt(start, 16); // Convert colour string to hexadecimal
  let endInt = parseInt(end, 16); // Same with end colour string
  return Math.round(lerp(startInt, endInt, amt)).toString(16); // Perform standard lerp, round off the result, and convert back to hexadecimal
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.mathUtils = {
    lerp,
    lerpColour
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    lerp,
    lerpColour
  }
}
