/** Planet/supercluster effect logic */
window.planetsLogic = window.planetsLogic || {}

window.planetsLogic.calculatePlanetEffect = function(state) {
  let effect = state.planets.pow(0.8).div(5).add(1)
  let superclusterTerm
  if (state.unlocks >= 35 && (state.nuclearPastaState == 4 || state.nuclearPastaUpgradesBought[3])) {
    superclusterTerm = state.superclusters.pow(0.7).div(8).add(1).mul(Decimal.min(new Decimal(0.02).mul(state.nuclearPasta.pow(0.6)).add(1), 1.3))
  } else if (state.voidMagicUpgradesBought[14] === true) {
    superclusterTerm = state.superclusters.pow(0.7).div(8).add(1)
  } else {
    superclusterTerm = state.superclusters.pow(0.7).div(10).add(1)
  }
  effect = effect.mul(superclusterTerm)
  if (state.voidMagicUpgradesBought[13] === true) effect = effect.mul(1.2)
  if (state.unlocks >= 31) effect = effect.mul(state.plagueUpgradesBought[1].add(1).log10().div(4).add(1))
  if (state.unlocks >= 32) effect = effect.add(state.oganessonUpgradesBought[2] * 2)
  let status = 'none'
  if (effect.gte(600)) {
    effect = effect.mul(600).pow(0.5)
    status = 'softcapped'
  }
  return { effect, status, superclusterTerm }
}

