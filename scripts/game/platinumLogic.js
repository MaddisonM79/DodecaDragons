/**
 * Pure platinum calculation logic - no DOM, no side effects
 */
window.platinumLogic = window.platinumLogic || {}

/**
 * Calculate platinum to get when converting gold
 * @param {Object} state
 * @returns {Decimal}
 */
window.platinumLogic.calculatePlatinumToGet = function(state) {
  const {
    gold, fireUpgrade6Bought, unlocks, uraniumUpgradesBought,
    blueSigilUpgradesBought, holyTetrahedronUpgradesBought,
    blueFireUpgradesBought, darkMagicUpgradesBought,
    challengesActive, selectedChallenges, inHell, currentHellLayer
  } = state

  let platinumToGet = gold.add(1).log2().mul(new Decimal(3).pow(fireUpgrade6Bought.pow(0.6)))

  if (unlocks >= 7) platinumToGet = platinumToGet.mul(1.2 ** uraniumUpgradesBought[0])
  if (unlocks >= 8) platinumToGet = platinumToGet.mul(10 ** uraniumUpgradesBought[4])
  if (unlocks >= 11) platinumToGet = platinumToGet.mul(new Decimal(1e15).pow(blueSigilUpgradesBought[1].pow(0.6)))
  if (holyTetrahedronUpgradesBought[4]) platinumToGet = platinumToGet.mul(1e20)
  if (unlocks >= 17) platinumToGet = platinumToGet.pow(blueFireUpgradesBought[2].add(1).log2().add(1))
  if (darkMagicUpgradesBought[12]) platinumToGet = platinumToGet.pow(666)
  if (challengesActive && selectedChallenges[1]) platinumToGet = platinumToGet.pow(0.25)

  if (inHell) {
    if (currentHellLayer == 1) platinumToGet = platinumToGet.pow(0.1)
    else if (currentHellLayer == 2) platinumToGet = platinumToGet.pow(0.01)
    else if (currentHellLayer == 3 || currentHellLayer == 4) platinumToGet = platinumToGet.add(1).log10()
    else if (currentHellLayer == 5) platinumToGet = platinumToGet.add(1).log10().pow(0.5)
  }

  return platinumToGet.floor()
}

/**
 * Calculate effect of Platinum Upgrade 6
 * @param {Object} state
 * @returns {Decimal}
 */
window.platinumLogic.calculatePlatinumUpgrade6Effect = function(state) {
  const { uraniumUpgradesBought, platinum, platinumUpgradesBought, challengesActive, selectedChallenges } = state
  let effect
  if (uraniumUpgradesBought[3]) effect = platinum.add(1).pow(platinumUpgradesBought[5] * 1.2)
  else effect = platinum.add(1).log10().add(1).pow(platinumUpgradesBought[5] * 1.2)
  if (challengesActive && selectedChallenges[3]) effect = effect.div(1e25)
  return effect
}

/**
 * Get the max for Platinum Upgrade 7
 * @param {Object} state
 * @returns {number}
 */
window.platinumLogic.getPlatinumUpgrade7Max = function(state) {
  const { magicUpgradesBought } = state
  return magicUpgradesBought[10] ? 20 : 10
}

/**
 * Calculate effect for Platinum Upgrade 7 (1.5^bought)
 * @param {Object} state
 * @returns {Decimal}
 */
window.platinumLogic.calculatePlatinumUpgrade7Effect = function(state) {
  const { platinumUpgradesBought } = state
  return new Decimal(1.5).pow(platinumUpgradesBought[6])
}
