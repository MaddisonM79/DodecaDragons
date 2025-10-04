/**
 * Pure logic for Holy Polyhedrons (tetra/octa/dodeca)
 */
window.holyPolyLogic = window.holyPolyLogic || {}

window.holyPolyLogic.calculateHolyTetrahedronsToGet = function(state) {
  let amt = state.gold.add(1).log10().div(1e30).pow(0.05)
  if (state.unlocks >= 26) {
    const hf2 = window.holyFireLogic.upg2Effect(state).eff
    amt = amt.mul(hf2)
  }
  if (state.voidMagicUpgradesBought[10] === true) amt = amt.mul(state.planets.pow(1.5).add(1))
  const nextAt = state.holyFireUpgradesBought[1].eq(0)
    ? new Decimal(10).pow(amt.ceil().pow(20).mul(1e30))
    : null
  return { toGet: amt.floor(), nextAt }
}

window.holyPolyLogic.calculateHolyOctahedronsToGet = function(state) {
  let amt = state.gold.add(1).log10().div(1e60).pow(0.02)
  if (state.unlocks >= 26) amt = amt.mul(new Decimal(2).pow(state.holyFireUpgradesBought[4].pow(0.6)))
  if (state.voidMagicUpgradesBought[0]) amt = amt.mul(10)
  if (state.voidMagicUpgradesBought[10] === true) amt = amt.mul(state.planets.pow(1.5).add(1))
  if (state.voidMagicUpgradesBought[9] === true) amt = amt.pow(1.25)
  const nextAt = state.holyFireUpgradesBought[4].eq(0)
    ? new Decimal(10).pow(amt.ceil().pow(50).mul(1e60))
    : null
  return { toGet: amt.floor(), nextAt }
}

window.holyPolyLogic.calculateHolyDodecahedronsToGet = function(state) {
  let amt = state.gold.add(1).log10().div(1e140).pow(0.02)
  if (state.voidMagicUpgradesBought[7] === true) {
    const hf6 = window.holyFireLogic.upg6Effect(state).eff
    amt = amt.mul(hf6)
  }
  if (state.voidMagicUpgradesBought[10] === true) amt = amt.mul(state.planets.pow(1.5).add(1))
  const nextAt = state.voidMagicUpgradesBought[7] !== true
    ? new Decimal(10).pow(amt.ceil().pow(50).mul(1e140))
    : null
  return { toGet: amt.floor(), nextAt }
}

