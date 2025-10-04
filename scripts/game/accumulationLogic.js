/**
 * Resource accumulation logic for DodecaDragons
 * Pure functions for calculating passive resource gains per second
 */

/**
 * Calculate resource accumulation based on per-second rate and time divider
 * @param {Decimal} currentAmount - Current resource amount
 * @param {Decimal} perSecondRate - Amount gained per second
 * @param {number} timeDivider - Time division factor (for dynamic tick rates)
 * @returns {Decimal} New resource amount
 */
function accumulateResource(currentAmount, perSecondRate, timeDivider) {
  return currentAmount.add(perSecondRate.div(timeDivider))
}

/**
 * Calculate all passive resource accumulations for updateLarge
 * @param {object} game - Game state object
 * @param {number} timeDivider - Time division factor
 * @returns {object} Object with all updated resource amounts
 */
function calculatePassiveAccumulation(game, timeDivider) {
  const updates = {}

  // Gold accumulation (with nuclear pasta check)
  if (game.unlocks < 35 || game.nuclearPastaUpgradesBought[3] || (game.nuclearPastaState != 2 && game.nuclearPastaState != 5)) {
    updates.gold = accumulateResource(game.gold, game.goldPerSecond, timeDivider)
  } else {
    updates.gold = game.gold
  }

  // Fire accumulation
  if (game.unlocks >= 1) {
    updates.fire = accumulateResource(game.fire, game.firePerSecond, timeDivider)
  }

  // Platinum accumulation
  if (game.platinumUpgradesBought[4] == 1) {
    updates.platinum = accumulateResource(game.platinum, game.platinumToGet, timeDivider)
  } else {
    updates.platinum = game.platinum
  }
  if (game.unlocks >= 3) {
    updates.platinum = updates.platinum.add(Decimal.max(game.bestPlatinumToGet.div(20), 2))
  }

  // Magic accumulation
  if (game.unlockedAchievements[3] > 7) {
    updates.magic = accumulateResource(game.magic, game.magicToGet, timeDivider)
  } else if (game.unlockedAchievements[3] > 5) {
    updates.magic = game.magic.add(game.magicToGet.div(100))
  } else {
    updates.magic = game.magic
  }

  // Uranium accumulation
  if (game.unlocks >= 7) {
    updates.uranium = game.uranium.add(Decimal.max(game.bestUraniumToGet.div(20), 1))
  } else {
    updates.uranium = game.uranium
  }
  if (game.unlockedAchievements[5] > 3) {
    updates.uranium = accumulateResource(updates.uranium, game.uraniumToGet, timeDivider)
  }

  // Sigil power accumulation
  if (game.unlocks >= 10) {
    updates.cyanSigilPower = accumulateResource(game.cyanSigilPower, game.cyanSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 11) {
    updates.blueSigilPower = accumulateResource(game.blueSigilPower, game.blueSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 12) {
    updates.indigoSigilPower = accumulateResource(game.indigoSigilPower, game.indigoSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 13) {
    updates.violetSigilPower = accumulateResource(game.violetSigilPower, game.violetSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 14) {
    updates.pinkSigilPower = accumulateResource(game.pinkSigilPower, game.pinkSigilPowerPerSecond, timeDivider)
  }

  // Blue fire accumulation
  if (game.unlocks >= 17) {
    updates.blueFire = accumulateResource(game.blueFire, game.blueFirePerSecond, timeDivider)
  }

  // Blood accumulation
  if (game.unlocks >= 18) {
    updates.blood = accumulateResource(game.blood, game.bloodPerSecond, timeDivider)
  }

  // Plutonium accumulation
  if (game.unlocks >= 20) {
    updates.plutonium = game.plutonium.add(Decimal.max(game.bestPlutoniumToGet.div(20), 0))
  } else {
    updates.plutonium = game.plutonium
  }
  if (game.unlockedAchievements[15] > 3) {
    updates.plutonium = accumulateResource(updates.plutonium, game.plutoniumToGet, timeDivider)
  }

  // Red/Orange/Yellow sigil power accumulation
  if (game.unlocks >= 21) {
    updates.redSigilPower = accumulateResource(game.redSigilPower, game.redSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 22) {
    updates.orangeSigilPower = accumulateResource(game.orangeSigilPower, game.orangeSigilPowerPerSecond, timeDivider)
  }
  if (game.unlocks >= 23) {
    updates.yellowSigilPower = accumulateResource(game.yellowSigilPower, game.yellowSigilPowerPerSecond, timeDivider)
  }

  // Holy fire accumulation
  if (game.unlocks >= 26 && game.holyTetrahedronUpgradesBought[11]) {
    updates.holyFire = accumulateResource(game.holyFire, game.holyFirePerSecond, timeDivider)
  }

  // Holy tetrahedron passive gain
  if (game.holyOctahedronUpgradesBought[4]) {
    updates.holyTetrahedrons = game.holyTetrahedrons.add(0.5)
  } else {
    updates.holyTetrahedrons = game.holyTetrahedrons
  }

  // Cosmic plague accumulation
  if (game.unlocks >= 31) {
    updates.cosmicPlague = accumulateResource(game.cosmicPlague, game.cosmicPlaguePerSecond, timeDivider)
  }

  // Essence accumulation
  if (game.unlocks >= 33) {
    updates.lightEssence = accumulateResource(game.lightEssence, game.lightEssencePerSecond, timeDivider)
    updates.darkEssence = accumulateResource(game.darkEssence, game.darkEssencePerSecond, timeDivider)
  }
  if (game.unlocks >= 34) {
    updates.deathEssence = accumulateResource(game.deathEssence, game.deathEssencePerSecond, timeDivider)
  }
  if (game.unlocks >= 36) {
    updates.finalityEssence = accumulateResource(game.finalityEssence, game.finalityEssencePerSecond, timeDivider)
  }

  // Oganesson (always accumulates)
  updates.oganesson = accumulateResource(game.oganesson, game.oganessonPerSecond, timeDivider)

  // Sigil accumulation (achievement-based)
  if (game.unlockedAchievements[13] > 0) {
    updates.cyanSigils = game.cyanSigils.add(game.cyanSigilsToGet.div(20))
    updates.blueSigils = game.blueSigils.add(game.blueSigilsToGet.div(20))
    updates.indigoSigils = game.indigoSigils.add(game.indigoSigilsToGet.div(20))
    updates.violetSigils = game.violetSigils.add(game.violetSigilsToGet.div(20))
    updates.pinkSigils = game.pinkSigils.add(game.pinkSigilsToGet.div(20))
  }

  if (game.unlockedAchievements[23] > 2) {
    updates.redSigils = accumulateResource(game.redSigils, game.redSigilsToGet, timeDivider)
    updates.orangeSigils = accumulateResource(game.orangeSigils, game.orangeSigilsToGet, timeDivider)
    updates.yellowSigils = accumulateResource(game.yellowSigils, game.yellowSigilsToGet, timeDivider)
  }

  // Holy polyhedron accumulation
  if (game.unlockedAchievements[24] > 0) {
    updates.holyTetrahedrons = accumulateResource(updates.holyTetrahedrons || game.holyTetrahedrons, game.holyTetrahedronsToGet, timeDivider)
    updates.holyOctahedrons = accumulateResource(game.holyOctahedrons, game.holyOctahedronsToGet, timeDivider)
    updates.holyDodecahedrons = accumulateResource(game.holyDodecahedrons, game.holyDodecahedronsToGet, timeDivider)
  }

  return updates
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.accumulationLogic = {
    accumulateResource,
    calculatePassiveAccumulation
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    accumulateResource,
    calculatePassiveAccumulation
  }
}
