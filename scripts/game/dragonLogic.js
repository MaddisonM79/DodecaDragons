/**
 * Pure dragon calculation logic - no DOM, no side effects
 */
window.dragonLogic = window.dragonLogic || {}

/**
 * Calculate dragon time effect and cap state
 * Mirrors logic in script.js but pure and reusable
 * @param {Object} state
 * @returns {{effect: Decimal, capped: boolean, cap: Decimal}}
 */
window.dragonLogic.calculateDragonTimeEffect = function(state) {
  const {
    dragonTimeSpent, tomeUpgradesBought, blueFireUpgradesBought,
    unlocks, holyFireUpgradesBought, voidMagicUpgradesBought
  } = state

  let effect = new Decimal(1.2).pow(dragonTimeSpent.pow(0.3))
  if (effect.gt(2)) effect = effect.add(2).pow(0.5)

  let cap = new Decimal(2.5)
  if (tomeUpgradesBought[8] === true) cap = cap.mul(blueFireUpgradesBought[4].pow(0.7).div(5).add(1))
  if (unlocks >= 26) cap = cap.mul(holyFireUpgradesBought[2].pow(0.7).mul(5).add(1))
  if (voidMagicUpgradesBought && voidMagicUpgradesBought[8] === true) cap = cap.mul(10000)

  let capped = false
  if (effect.gt(cap)) { effect = cap; capped = true }

  return { effect, capped, cap }
}

/**
 * Calculate dragon time increment based on elapsed 30s ticks and upgrades
 * @param {number} ticks30s - integer count of 30-second ticks since last grant, min 1
 * @param {Object} state
 * @returns {Decimal}
 */
window.dragonLogic.calculateDragonTimeIncrement = function(ticks30s, state) {
  const { darkMagicUpgradesBought, unlocks, indigoSigilUpgradesBought } = state
  let inc = new Decimal(1 + Math.floor(ticks30s))
  if (darkMagicUpgradesBought[2]) inc = inc.mul(10)
  if (unlocks >= 12) inc = inc.mul(new Decimal(2).pow(indigoSigilUpgradesBought[2].pow(0.6)))
  return inc.floor()
}

/** Calculate dragon food effect: 1.3^food */
window.dragonLogic.calculateDragonFoodEffect = function(state) {
  return new Decimal(1.3).pow(state.dragonFood)
}

/** Calculate dragon feed cost at current food */
window.dragonLogic.calculateDragonFeedCost = function(state) {
  return new Decimal(10).pow(new Decimal(2).pow(state.dragonFood).mul(8).round())
}

/** Max feeds buyable from magifolds (achievement-gated in caller) */
window.dragonLogic.calculateMaxFeedsBuyable = function(magifolds) {
  return new Decimal(magifolds).log10().log10().div(0.301).sub(3).floor().add(1)
}

/** Dragon pet effect: 5^(sqrt(pets)) */
window.dragonLogic.calculateDragonPetEffect = function(pets) {
  return new Decimal(5).pow(Math.sqrt(pets))
}
