/** Oganesson logic */
window.oganessonLogic = window.oganessonLogic || {}

window.oganessonLogic.calculateOganessonPerSecond = function(state) {
  let ops = Decimal.max(state.plutonium.log10().div(1e9).floor(), 0)
  if (state.plagueUpgradesBought[4].gt(0)) ops = ops.mul(new Decimal(2).pow(state.plagueUpgradesBought[4].pow(0.5)))
  if (state.unlockedAchievements[24] > 2) ops = ops.mul(10)
  if (state.unlocks >= 33) ops = ops.mul(new Decimal(1.5).pow(state.darkEssenceUpgradesBought[1].pow(0.6)))
  if (state.unlocks >= 35 && state.nuclearPastaState == 5) ops = ops.mul(Decimal.min(new Decimal(1.5).pow(state.nuclearPasta.pow(0.6)), 1e30))
  return ops
}

// Oganesson upgrade effects for UI
window.oganessonLogic.upg1Effect = s => s.oganessonUpgradesBought[0] / 50 + 1
window.oganessonLogic.upg2Effect = s => 1.5 ** s.oganessonUpgradesBought[1]
window.oganessonLogic.upg3Effect = s => s.oganessonUpgradesBought[2] * 2
window.oganessonLogic.upg5Effect = s => s.oganesson.log10().div(10).add(1).pow(s.oganessonUpgradesBought[4])
window.oganessonLogic.upg6Effect = s => 1.5 ** s.oganessonUpgradesBought[5]
window.oganessonLogic.upg7Effect = s => s.oganessonUpgradesBought[6] ** 1.2 * 2 + 1

