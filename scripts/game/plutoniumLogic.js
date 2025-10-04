/**
 * Pure plutonium calculation logic
 */
window.plutoniumLogic = window.plutoniumLogic || {}

window.plutoniumLogic.calculatePlutoniumToGet = function(state) {
  let p = state.uranium.add(1).log10().div(1e13).mul(1 + 0.05 * state.plutoniumUpgradesBought[0])
  if (state.darkMagicUpgradesBought[14]) p = p.mul(10)
  if (state.darkMagicUpgradesBought[18]) p = p.pow(2)
  if (state.holyDodecahedronUpgradesBought[2]) p = p.mul(1e20)
  if (state.unlocks >= 26) p = p.pow(state.holyFireUpgradesBought[3].pow(0.6).mul(2.5).add(1))
  if (state.unlocks >= 32) p = p.pow(state.oganessonUpgradesBought[0] / 50 + 1)
  if (state.unlocks >= 36) p = p.pow(new Decimal(1.2).pow(state.finalityEssenceUpgradesBought[2].pow(0.5)))
  return p.floor()
}

window.plutoniumLogic.plutoniumUpgrade2Effect = s => (s.plutoniumUpgradesBought[1] * 100000) ** 0.8 + 1
window.plutoniumLogic.plutoniumUpgrade3Effect = s => s.plutonium.add(1).pow(0.5).mul(10).pow(s.plutoniumUpgradesBought[2])
window.plutoniumLogic.extraPlutoniumPerSecond = s => Decimal.max(s.bestPlutoniumToGet.div(10), 0)

