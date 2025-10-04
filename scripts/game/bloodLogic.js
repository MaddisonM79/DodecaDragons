/**
 * Pure blood calculation logic - no DOM, no side effects
 */
window.bloodLogic = window.bloodLogic || {}

/**
 * Calculate blood per second based on state
 * Mirrors logic from script.js (unlocks >= 18 section)
 */
window.bloodLogic.calculateBloodPerSecond = function(state) {
  const {
    voidMagicUpgradesBought, gold, inHell, currentHellLayer,
    darkMagicUpgradesBought, blood, plutonium, unlocks,
    redSigilUpgradesBought, orangeSigilUpgradesBought, yellowSigilUpgradesBought,
    holyOctahedronUpgradesBought, holyDodecahedronUpgradesBought,
    holyDodecahedrons, holyTetrahedronUpgradesBought
  } = state

  if (voidMagicUpgradesBought[6]) return gold.add(1).log10()

  let bps = new Decimal(0)
  if (inHell) {
    const g = gold.add(1).log10()
    if (currentHellLayer == 1) bps = g.pow(2).div(1000).floor()
    else if (currentHellLayer == 2) bps = g.pow(3.5).div(75000).floor()
    else if (currentHellLayer == 3) bps = g.pow(5).div(1e6).floor()
    else if (currentHellLayer == 4) bps = g.pow(8).div(1e7).floor()
    else if (currentHellLayer == 5) bps = g.pow(15).div(1e10).floor()

    if (darkMagicUpgradesBought[11]) bps = bps.mul(blood.add(1).log10().div(1.5).add(1))
    if (darkMagicUpgradesBought[13]) bps = bps.mul(plutonium.add(1).log2().add(1))
    if (unlocks >= 21) bps = bps.mul(new Decimal(6).pow(redSigilUpgradesBought[2].pow(0.7)))
    if (unlocks >= 22) bps = bps.mul(new Decimal(6).pow(orangeSigilUpgradesBought[2].pow(0.7)))
    if (unlocks >= 23) bps = bps.mul(new Decimal(15).pow(yellowSigilUpgradesBought[2].pow(0.5)))
    if (holyOctahedronUpgradesBought[2]) bps = bps.mul(new Decimal(1e9).pow(state.currentHellLayer))
    if (holyDodecahedronUpgradesBought[1]) bps = bps.mul(holyDodecahedrons.add(1).pow(10))
    if (holyTetrahedronUpgradesBought[6] && bps.lt(1e9)) bps = new Decimal(1e9)
  } else {
    bps = new Decimal(0)
  }

  return bps
}

// Display helper: blood effect multiplier
window.bloodLogic.calculateBloodEffect = function(state) {
  return state.blood.pow(2).add(1)
}

// Display helper: Tome upgrade 11 effect text
window.bloodLogic.tomeUpgrade11Effect = function(state) {
  return state.blood.add(1).log10().add(1)
}

