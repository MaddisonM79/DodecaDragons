/**
 * Time tracking logic for DodecaDragons
 * Handles game time played calculations and formatting
 */

/**
 * Calculate time played string from total seconds
 * @param {number} totalSeconds - Total time played in seconds
 * @returns {string} Formatted time string (HH:MM:SS)
 */
function calculateTimePlayedString(totalSeconds) {
  const timePlayedFloor = Math.floor(totalSeconds)
  const hours = Math.floor(timePlayedFloor / 3600)
  const minutes = Math.floor(timePlayedFloor / 60) % 60
  const seconds = timePlayedFloor % 60

  return hours + ":" +
         ((minutes < 10 ? '0' : '') + minutes) + ":" +
         ((seconds < 10 ? '0' : '') + seconds)
}

/**
 * Update time played in game state
 * @param {object} game - Game state object
 * @param {number} lastUpdate - Timestamp of last update
 * @param {boolean} isPaused - Whether the game is paused (e.g., bigFinish active)
 * @returns {object} Object containing updated timePlayed and formatted string
 */
function updateTimePlayed(game, lastUpdate, isPaused = false) {
  if (isPaused) {
    return {
      timePlayed: game.timePlayed,
      timeString: calculateTimePlayedString(game.timePlayed)
    }
  }

  const now = Date.now()
  const diff = (now - lastUpdate) / 1000
  const newTimePlayed = game.timePlayed + diff

  return {
    timePlayed: newTimePlayed,
    timeString: calculateTimePlayedString(newTimePlayed),
    lastUpdate: now
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.timeLogic = {
    calculateTimePlayedString,
    updateTimePlayed
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateTimePlayedString,
    updateTimePlayed
  }
}
