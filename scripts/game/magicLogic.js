/**
 * Pure magic calculation logic - no DOM, no side effects
 */
window.magicLogic = window.magicLogic || {}

/**
 * Calculate magic gain (on reset)
 * Ported from getMagicGain(), but pure on input state
 */
window.magicLogic.calculateMagicToGet = function(state) {
  const {
    gold, magic, magicUpgradesBought, unlocks,
    cyanSigils, blueSigils, indigoSigils, violetSigils, pinkSigils,
    darkMagicUpgradesBought, uranium, tomeUpgradesBought, blueFireUpgradesBought
  } = state

  let toGet = gold.div(1e15).pow(0.1)
  if (magicUpgradesBought[3]) {
    if (magicUpgradesBought[9]) toGet = toGet.mul(magic.add(1).log2().mul(4).add(1))
    else toGet = toGet.mul(magic.add(1).log2().mul(1.5).add(1))
  }
  if (magicUpgradesBought[1]) toGet = toGet.mul(1.5)
  if (magicUpgradesBought[6]) toGet = toGet.mul(2)
  if (magicUpgradesBought[17]) toGet = toGet.mul(3)
  if (unlocks >= 10) toGet = toGet.mul(cyanSigils.add(1).pow(2))
  if (unlocks >= 11) toGet = toGet.mul(blueSigils.add(1).pow(3))
  if (unlocks >= 12) toGet = toGet.mul(indigoSigils.add(1).pow(4))
  if (unlocks >= 13) toGet = toGet.mul(violetSigils.add(1).pow(5))
  if (unlocks >= 14) toGet = toGet.mul(pinkSigils.add(1).pow(6))
  if (darkMagicUpgradesBought[9] === true) toGet = toGet.pow(1.1)
  if (darkMagicUpgradesBought[1]) toGet = toGet.pow(uranium.add(1).log10().div(30).add(1))

  // Hard cap
  let magicHardcap = new Decimal("e5000000")
  if (tomeUpgradesBought[8] === true) magicHardcap = magicHardcap.pow(blueFireUpgradesBought[3].pow(0.7).mul(5).add(1))
  if (toGet.gt(magicHardcap)) toGet = magicHardcap

  return toGet.floor()
}

/**
 * Calculate next magic threshold (for UI)
 */
window.magicLogic.calculateNextMagicAt = function(state) {
  const { magicToGet, magicUpgradesBought, unlocks, magic } = state
  let nextMagic = magicToGet.add(1)
  if (magicUpgradesBought[17]) nextMagic = nextMagic.div(3)
  if (magicUpgradesBought[6]) nextMagic = nextMagic.div(2)
  if (magicUpgradesBought[1]) nextMagic = nextMagic.div(1.5)
  if (magicUpgradesBought[3]) {
    if (magicUpgradesBought[9]) nextMagic = nextMagic.div(magic.add(1).log2().mul(4).add(1))
    else nextMagic = nextMagic.div(magic.add(1).log2().mul(1.5).add(1))
  }
  nextMagic = nextMagic.pow(10).mul(1e15).add(1)
  if (unlocks >= 10) nextMagic = new Decimal(6969) // hidden by this point
  return nextMagic
}

/**
 * Calculate magicEffect and whether the softcap triggers
 */
window.magicLogic.calculateMagicEffect = function(state) {
  const {
    magic, platinumUpgradesBought, magicUpgradesBought,
    plutoniumUpgradesBought, inHell, currentHellLayer,
    challengesActive, selectedChallenges
  } = state

  let effect = magic.mul(3).mul(new Decimal(1.5).pow(platinumUpgradesBought[6])).add(1)
  if (magicUpgradesBought[15]) effect = effect.pow(2)
  if (plutoniumUpgradesBought[1] > 0) effect = effect.pow((plutoniumUpgradesBought[1] * 100000) ** 0.8 + 1)
  if (inHell && currentHellLayer >= 5) effect = effect.add(1).log10()
  if (challengesActive && selectedChallenges[0]) effect = magic.pow(0.2).div(1e15)

  // Pre-softcap check for label
  const softcapped = effect.gt("e1000")

  if (effect.gt("e1000")) {
    effect = effect.mul("e1000").pow(0.5)
  }
  if (effect.gt("e100000")) {
    effect = effect.mul("e900000").pow(0.1)
  }

  return { effect, softcapped }
}

// Upgrade effect helpers for UI
window.magicLogic.magicUpgrade1Effect = function(state) {
  return state.gold.add(1).log10().add(1)
}
window.magicLogic.magicUpgrade4Effect = function(state) {
  return state.magicUpgradesBought[9]
    ? state.magic.add(1).log2().mul(4).add(1)
    : state.magic.add(1).log2().mul(1.5).add(1)
}
window.magicLogic.magicUpgrade5Effect = function(state) {
  return state.gold.add(1).log2().add(1)
}
window.magicLogic.magicUpgrade6Effect = function(state) {
  return state.magicUpgradesBought[9]
    ? state.miners.pow(3).add(1)
    : state.miners.pow(1.5).add(1)
}

