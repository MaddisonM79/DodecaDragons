/**
 * Cooldown logic for DodecaDragons
 * Pure functions for cooldown timer calculations
 */

/**
 * Update a cooldown timer
 * @param {number} currentCooldown - Current cooldown value
 * @param {number} decrementAmount - Amount to decrease (default: 0.5)
 * @returns {object} Object with new cooldown value and whether it reached zero
 */
function updateCooldown(currentCooldown, decrementAmount = 0.5) {
  if (currentCooldown <= 0) {
    return {
      cooldown: 0,
      reachedZero: false,
      justReachedZero: false
    }
  }

  const newCooldown = Math.max(0, currentCooldown - decrementAmount)
  // Use <= 0.001 to handle floating point precision issues
  const justReachedZero = currentCooldown > 0.001 && newCooldown <= 0.001

  return {
    cooldown: newCooldown <= 0.001 ? 0 : newCooldown, // Snap to 0 if very close
    reachedZero: newCooldown <= 0.001,
    justReachedZero
  }
}

/**
 * Update all game cooldowns
 * @param {object} game - Game state object
 * @param {number} decrementAmount - Amount to decrease each cooldown (default: 0.5)
 * @returns {object} Object with updated cooldown values and flags
 */
function updateAllCooldowns(game, decrementAmount = 0.5) {
  const platinum = updateCooldown(game.platinumConvertCooldown, decrementAmount)
  const uranium = updateCooldown(game.uraniumConvertCooldown, decrementAmount)
  const dragon = updateCooldown(game.dragonTimeCooldown, decrementAmount)
  const plutonium = updateCooldown(game.plutoniumConvertCooldown, decrementAmount)
  const nuclearPasta = updateCooldown(game.nuclearPastaCooldown, decrementAmount)

  return {
    platinum,
    uranium,
    dragon,
    plutonium,
    nuclearPasta
  }
}

/**
 * Check if a cooldown should enable a button
 * @param {number} cooldown - Current cooldown value
 * @returns {boolean} True if button should be enabled
 */
function shouldEnableButton(cooldown) {
  return cooldown === 0
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.cooldownLogic = {
    updateCooldown,
    updateAllCooldowns,
    shouldEnableButton
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateCooldown,
    updateAllCooldowns,
    shouldEnableButton
  }
}
