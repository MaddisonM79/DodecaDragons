/** Essence layers logic (light/dark; death/finality left for later) */
window.essenceLogic = window.essenceLogic || {}

window.essenceLogic.calculateLightEssencePerSecond = function(state) {
  let les = state.darkEssence.add(1).log10().add(1)
  les = les.mul(new Decimal(2).pow(state.lightEssenceUpgradesBought[0].pow(0.5)))
  les = les.mul(state.oganessonUpgradesBought[6] ** 1.2 * 2 + 1)
  if (state.unlockedAchievements[24] > 3) les = les.mul(5)
  if (state.unlocks >= 34) {
    les = les.mul(state.deathEssence.add(1).log10().mul(2).add(1))
    les = les.mul(new Decimal(10000).pow(state.deathEssenceUpgradesBought[4].pow(0.5)))
  }
  if (state.dragonStage >= 10) les = les.mul(1000)
  if (state.unlocks >= 35 && (state.nuclearPastaState == 1 || state.nuclearPastaUpgradesBought[0])) les = les.mul(Decimal.min(new Decimal(3).pow(state.nuclearPasta.pow(0.7)), 1e75))
  else if (state.unlocks >= 35 && state.nuclearPastaState == 3) les = new Decimal(0)
  if (state.unlocks >= 36) les = les.mul(new Decimal(10000).pow(state.finalityEssenceUpgradesBought[3].pow(0.5)))
  if (state.unlocks >= 37) les = les.mul(state.finalityCubeEffect)
  return les
}

window.essenceLogic.calculateDarkEssencePerSecond = function(state) {
  let des = state.lightEssence.add(1).log10().add(1)
  des = des.mul(new Decimal(2).pow(state.darkEssenceUpgradesBought[0].pow(0.5)))
  des = des.mul(state.oganessonUpgradesBought[6] ** 1.2 * 2 + 1)
  if (state.unlockedAchievements[24] > 3) des = des.mul(5)
  if (state.unlocks >= 34) {
    des = des.mul(state.deathEssence.add(1).log10().mul(2).add(1))
    des = des.mul(new Decimal(10000).pow(state.deathEssenceUpgradesBought[4].pow(0.5)))
  }
  if (state.dragonStage >= 10) des = des.mul(1000)
  if (state.unlocks >= 35 && (state.nuclearPastaState == 1 || state.nuclearPastaUpgradesBought[0])) des = des.mul(Decimal.min(new Decimal(3).pow(state.nuclearPasta.pow(0.7)), 1e75))
  else if (state.unlocks >= 35 && state.nuclearPastaState == 3) des = new Decimal(0)
  if (state.unlocks >= 36) des = des.mul(new Decimal(10000).pow(state.finalityEssenceUpgradesBought[3].pow(0.5)))
  if (state.unlocks >= 37) des = des.mul(state.finalityCubeEffect)
  return des
}

window.essenceLogic.calculateDeathEssencePerSecond = function(state) {
  let des = state.darkEssence.add(state.lightEssence).pow(0.4).div(100)
  des = des.mul(new Decimal(2).pow(state.deathEssenceUpgradesBought[0].pow(0.5)))
  if (state.unlocks >= 35 && (state.nuclearPastaState == 2 || state.nuclearPastaUpgradesBought[1])) des = des.mul(Decimal.min(new Decimal(2.5).pow(state.nuclearPasta.pow(0.6)), 1e7))
  else if (state.unlocks >= 35 && state.nuclearPastaState == 1) des = new Decimal(0)
  if (state.unlockedAchievements[24] > 4) des = des.mul(10)
  if (state.unlocks >= 36) des = des.mul(state.finalityEssence.add(1).log10().mul(2).add(1))
  if (des.gt(1e20)) des = des.mul(1e20).pow(0.5)
  if (state.dragonStage >= 11) des = des.mul(100)
  if (state.unlocks >= 37) des = des.mul(state.finalityCubeEffect)
  return des
}

window.essenceLogic.calculateFinalityEssencePerSecond = function(state) {
  let fes = state.deathEssence.add(state.lightEssence).pow(0.3).div(1e16)
  fes = fes.mul(new Decimal(2).pow(state.finalityEssenceUpgradesBought[0].pow(0.5)))
  if (state.dragonStage >= 11) fes = fes.mul(100)
  if (state.unlockedAchievements[24] > 8) fes = fes.mul(100)
  if (state.unlocks >= 37) fes = fes.mul(state.finalityCubeEffect)
  if (state.unlockedAchievements[24] > 9) fes = fes.mul(100)
  if (state.unlockedAchievements[24] > 10) fes = fes.mul(1e7)
  if (state.unlockedAchievements[24] > 11) fes = fes.mul(1e28)
  return fes
}

window.essenceLogic.finalityEssenceMultiplier = s => s.finalityEssence.add(1).log10().mul(2).add(1)

window.essenceLogic.calculateFinalityCubeEffect = function(state) {
  let effect = new Decimal(100).pow(state.finalityCubes.pow(0.5))
  effect = effect.mul(new Decimal(50000).pow(state.finalityBoosts.pow(0.8)))
  effect = effect.mul(new Decimal(100000).pow(state.finalityBoostBoosts.pow(0.7)))
  if (effect.gt(1e100)) effect = new Decimal(1e100)
  return effect
}

// Finality essence upgrade effect helpers
window.essenceLogic.finalityUpg1Effect = s => new Decimal(2).pow(s.finalityEssenceUpgradesBought[0].pow(0.5))
window.essenceLogic.finalityUpg2Effect = s => new Decimal(1.1).pow(s.finalityEssenceUpgradesBought[1].pow(0.5))
window.essenceLogic.finalityUpg3Effect = s => new Decimal(1.2).pow(s.finalityEssenceUpgradesBought[2].pow(0.5))
window.essenceLogic.finalityUpg4Effect = s => new Decimal(10000).pow(s.finalityEssenceUpgradesBought[3].pow(0.5))

// Death essence upgrade effects (extracted from updateLarge)
window.essenceLogic.deathUpg1Effect = s => new Decimal(2).pow(s.deathEssenceUpgradesBought[0].pow(0.5))

window.essenceLogic.deathUpg2Effect = function(s) {
  if (s.deathEssenceUpgradesBought[1].gt(0)) {
    return new Decimal(10).pow(new Decimal(2).pow(s.deathEssenceUpgradesBought[1].pow(0.5)).mul(1e10))
  }
  return new Decimal(1)
}

// Returns { effect: Decimal, softcapLabel: string }
window.essenceLogic.deathUpg3Effect = function(s) {
  if (!s.deathEssenceUpgradesBought[2].gt(0)) {
    return { effect: new Decimal(1), softcapLabel: '' }
  }
  let prePow = new Decimal(2).pow(s.deathEssenceUpgradesBought[2].pow(0.7)).mul(10000)
  let softcapLabel = ''
  if (prePow.gt(500000)) {
    prePow = prePow.mul(500000).pow(0.5)
    if (prePow.gt(1e9)) {
      prePow = new Decimal(1e9)
      softcapLabel = ' (hardcapped)'
    } else {
      softcapLabel = ' (softcapped)'
    }
  }
  const effect = new Decimal(10).pow(prePow)
  return { effect, softcapLabel }
}

window.essenceLogic.deathUpg4Effect = s => new Decimal(20).pow(s.deathEssenceUpgradesBought[3].pow(0.7))
window.essenceLogic.deathUpg5Effect = s => new Decimal(10000).pow(s.deathEssenceUpgradesBought[4].pow(0.5))
