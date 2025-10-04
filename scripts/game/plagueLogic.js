/** Cosmic Plague logic */
window.plagueLogic = window.plagueLogic || {}

window.plagueLogic.calculateCosmicPlaguePerSecond = function(state) {
  let cps = state.spores.pow(2)
  cps = cps.mul(state.plagueUpgradesBought[0].pow(1.3).add(1))
  if (state.unlockedAchievements[24] > 0) cps = cps.mul(5)
  if (state.unlockedAchievements[24] > 1) cps = cps.mul(5)
  if (state.dragonStage >= 9) cps = cps.mul(100)
  if (state.unlocks >= 32) {
    cps = cps.mul(1.5 ** state.oganessonUpgradesBought[1])
    cps = cps.mul(1.5 ** state.oganessonUpgradesBought[5])
  }
  if (state.unlocks >= 33) cps = cps.mul(new Decimal(2).pow(state.lightEssenceUpgradesBought[1].pow(0.6)))
  if (state.unlocks >= 34) cps = cps.mul(new Decimal(10).pow(state.deathEssenceUpgradesBought[3].pow(0.7)))
  if (state.unlocks >= 35 && (state.nuclearPastaState == 3 || state.nuclearPastaUpgradesBought[2])) cps = cps.mul(Decimal.min(new Decimal(10).pow(state.nuclearPasta.pow(0.7)), "1e1500"))
  else if (state.unlocks >= 35 && state.nuclearPastaState == 4) cps = new Decimal(0)
  return cps
}

// Plague upgrade effect helpers (for UI)
window.plagueLogic.upg1Effect = s => s.plagueUpgradesBought[0].pow(1.3).add(1)
window.plagueLogic.upg2Effect = s => s.plagueUpgradesBought[1].add(1).log10().div(4).add(1)
window.plagueLogic.upg3Effect = s => s.plagueUpgradesBought[2].pow(0.5).mul(10).add(1)
window.plagueLogic.upg4Effect = s => s.plagueUpgradesBought[3].pow(0.5).div(10).add(1)
window.plagueLogic.upg5Effect = s => new Decimal(2).pow(s.plagueUpgradesBought[4].pow(0.5))

