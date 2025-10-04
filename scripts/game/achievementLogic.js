/**
 * Achievement checking logic for DodecaDragons
 * Pure functions for determining if achievements are unlocked
 * Separated from DOM manipulation for Vue migration prep
 */

/**
 * Check if a specific achievement should be unlocked
 * @param {Decimal} resourceAmount - Current amount of the resource
 * @param {Decimal|number} requirement - Amount required for achievement
 * @returns {boolean} True if achievement requirement is met
 */
function checkAchievementRequirement(resourceAmount, requirement) {
  return new Decimal(resourceAmount).gte(requirement)
}

/**
 * Find all newly unlocked achievements for a single resource category
 * @param {string} resourceName - Internal resource name (e.g., "cyanSigils")
 * @param {Decimal} resourceAmount - Current resource amount
 * @param {number} currentUnlocked - Number of achievements already unlocked (0-11)
 * @param {Array} requirements - Array of achievement requirements
 * @param {number} maxLoops - Safety limit for while loop (default: 10)
 * @returns {Array} Array of achievement indices that were just unlocked
 */
function findNewlyUnlockedAchievements(resourceName, resourceAmount, currentUnlocked, requirements, maxLoops = 10) {
  const newlyUnlocked = []
  let checkIndex = currentUnlocked
  let loops = 0

  while (
    loops < maxLoops &&
    checkIndex < requirements.length &&
    requirements[checkIndex] !== undefined &&
    checkAchievementRequirement(resourceAmount, requirements[checkIndex])
  ) {
    newlyUnlocked.push(checkIndex)
    checkIndex++
    loops++
  }

  return newlyUnlocked
}

/**
 * Check if an achievement star requirement is met
 * @param {Decimal} resourceAmount - Current resource amount
 * @param {Decimal|number} starRequirement - Star requirement amount
 * @returns {boolean} True if star requirement is met
 */
function checkStarRequirement(resourceAmount, starRequirement) {
  const requirement = new Decimal(starRequirement)
  if (requirement.isNaN || !requirement.gte(1)) {
    return false // Invalid or undefined requirement
  }
  return new Decimal(resourceAmount).gte(requirement)
}

/**
 * Determine achievement category status
 * @param {number} unlockedCount - Number of achievements unlocked for this category
 * @returns {object} Object with status flags
 */
function getAchievementCategoryStatus(unlockedCount) {
  return {
    allStarsEarned: unlockedCount > 23,
    checkingStars: unlockedCount > 11,
    checkingRegular: unlockedCount <= 11,
    currentTier: unlockedCount <= 11 ? 'regular' : 'stars'
  }
}

/**
 * Calculate next achievement requirement
 * @param {Array} requirements - Array of achievement requirements
 * @param {number} currentUnlocked - Number currently unlocked
 * @returns {Decimal|null} Next requirement or null if all unlocked
 */
function getNextAchievementRequirement(requirements, currentUnlocked) {
  if (currentUnlocked >= requirements.length || requirements[currentUnlocked] === undefined) {
    return null
  }
  return new Decimal(requirements[currentUnlocked])
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.achievementLogic = {
    checkAchievementRequirement,
    findNewlyUnlockedAchievements,
    checkStarRequirement,
    getAchievementCategoryStatus,
    getNextAchievementRequirement
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAchievementRequirement,
    findNewlyUnlockedAchievements,
    checkStarRequirement,
    getAchievementCategoryStatus,
    getNextAchievementRequirement
  }
}
