/**
 * Pure fire calculation logic - no DOM, no side effects
 */

window.fireLogic = window.fireLogic || {}

/**
 * Calculate fire per second based on game state
 * @param {Object} state
 * @returns {Decimal}
 */
window.fireLogic.calculateFirePerSecond = function(state) {
  const {
    voidMagicUpgradesBought, magicUpgradesBought, unlocks,
    fireUpgrade1Bought, fireUpgrade5Bought, gold, platinumUpgradesBought,
    dragonStage, dragonFood, blueFireUpgradesBought, holyTetrahedronUpgradesBought,
    challengesActive, selectedChallenges, inHell, currentHellLayer
  } = state

  let firePerSecond

  if (voidMagicUpgradesBought[5]) {
    firePerSecond = gold
  } else if (voidMagicUpgradesBought[4]) {
    firePerSecond = gold.pow("1e-10")
  } else {
    firePerSecond = (magicUpgradesBought[13]
      ? new Decimal(3.5).pow(fireUpgrade1Bought.pow(0.7))
      : new Decimal(2).pow(fireUpgrade1Bought.pow(0.6)))

    if (unlocks >= 2) {
      firePerSecond = firePerSecond.mul(
        fireUpgrade5Bought.pow(1.5).mul(gold.add(1).log10()).div(5).add(1)
      )
    }

    if (unlocks >= 3) firePerSecond = firePerSecond.mul(1 + platinumUpgradesBought[1] * 0.2)
    if (magicUpgradesBought[2]) firePerSecond = firePerSecond.mul(55.5)
    if (magicUpgradesBought[4]) firePerSecond = firePerSecond.mul(gold.add(1).log2().add(1))

    if (dragonStage == 5) firePerSecond = firePerSecond.mul(1e15)
    else if (dragonStage == 4) firePerSecond = firePerSecond.mul(1e8)
    else if (dragonStage == 3) firePerSecond = firePerSecond.mul(10000)
    else if (dragonStage == 2) firePerSecond = firePerSecond.mul(100)

    if (dragonStage >= 5) firePerSecond = firePerSecond.pow(new Decimal(1.3).pow(dragonFood))
    if (unlocks >= 17) firePerSecond = firePerSecond.pow(blueFireUpgradesBought[1].add(1).log10().div(4).add(1))
    if (holyTetrahedronUpgradesBought[9]) firePerSecond = firePerSecond.pow(10000)

    if (challengesActive && selectedChallenges[2]) {
      firePerSecond = firePerSecond.pow(magicUpgradesBought[14] ? 0.3 : 0.1)
    }

    if (inHell) {
      if (currentHellLayer == 2 || currentHellLayer == 3) firePerSecond = firePerSecond.add(1).log10()
      else if (currentHellLayer >= 4) firePerSecond = new Decimal(0)
    }
  }

  return firePerSecond
}

/**
 * Calculate fire gold multiplier based on game state
 * @param {Object} state
 * @returns {Decimal}
 */
window.fireLogic.calculateFireGoldMultiplier = function(state) {
  const { fire, darkMagicUpgradesBought, magicUpgradesBought, fireUpgrade2Bought } = state

  if (darkMagicUpgradesBought[5]) {
    return fire.div(10).add(1).log10().mul(2).add(1).mul(new Decimal(5).pow(fireUpgrade2Bought.pow(0.8)))
  } else if (magicUpgradesBought[8]) {
    return fire.div(10).add(1).log10().mul(2).add(1).mul(new Decimal(1.6).pow(fireUpgrade2Bought.pow(0.8)))
  } else {
    return fire.div(10).add(1).log10().mul(2).add(1).mul(new Decimal(1.25).pow(fireUpgrade2Bought.pow(0.8)))
  }
}

/**
 * Fire upgrade effect helpers (used for UI text and effects)
 */
window.fireLogic.calculateFireUpgrade1Effect = function(state) {
  const { magicUpgradesBought, fireUpgrade1Bought } = state
  return magicUpgradesBought[13]
    ? new Decimal(3.5).pow(fireUpgrade1Bought.pow(0.7))
    : new Decimal(2).pow(fireUpgrade1Bought.pow(0.6))
}

window.fireLogic.calculateFireUpgrade2Effect = function(state) {
  const { darkMagicUpgradesBought, magicUpgradesBought, fireUpgrade2Bought, fire } = state
  // Mirrors multiplier scaffold used in gold multiplier calc, but this is the upgrade 2 effect text
  if (darkMagicUpgradesBought[5]) return new Decimal(5).pow(fireUpgrade2Bought.pow(0.8))
  if (magicUpgradesBought[8]) return new Decimal(1.6).pow(fireUpgrade2Bought.pow(0.8))
  return new Decimal(1.25).pow(fireUpgrade2Bought.pow(0.8))
}

window.fireLogic.calculateFireUpgrade3Effect = function(state) {
  const { magicUpgradesBought, fireUpgrade3Bought } = state
  return magicUpgradesBought[8]
    ? fireUpgrade3Bought.pow(12).mul(4).add(1)
    : fireUpgrade3Bought.pow(2.6).mul(4).add(1)
}

window.fireLogic.calculateFireUpgrade4Effect = function(state) {
  const { platinumUpgradesBought, fireUpgrade4Bought, miners } = state
  if (platinumUpgradesBought[8] > 0) return fireUpgrade4Bought.pow(miners.pow(0.3)).pow(platinumUpgradesBought[8] / 4).add(1)
  return fireUpgrade4Bought.pow(1.5).mul(miners).div(50).add(1)
}

window.fireLogic.calculateFireUpgrade5Effect = function(state) {
  const { fireUpgrade5Bought, gold } = state
  return fireUpgrade5Bought.pow(1.5).mul(gold.add(1).log10()).div(5).add(1)
}

window.fireLogic.calculateFireUpgrade6Effect = function(state) {
  const { fireUpgrade6Bought } = state
  return new Decimal(3).pow(fireUpgrade6Bought.pow(0.6))
}
