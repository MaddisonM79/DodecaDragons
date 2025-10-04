/**
 * Pure uranium calculation logic
 */
window.uraniumLogic = window.uraniumLogic || {}

window.uraniumLogic.calculateUraniumToGet = function(state) {
  let u = state.platinum.add(1).log2().mul(1 + 0.1 * state.uraniumUpgradesBought[1])
  if (state.unlocks >= 8) u = u.mul(2 ** state.platinumUpgradesBought[7])
  if (state.darkMagicUpgradesBought[4]) u = u.mul(100)
  if (state.unlocks >= 10) u = u.mul(state.cyanSigilUpgradesBought[1].add(1).pow(1.5))
  if (state.holyTetrahedronUpgradesBought[5]) u = u.mul(100)
  if (state.unlocks >= 15) {
    let knowledgeUpgrade2Effect = new Decimal(5).pow(state.knowledgeUpgradesBought[1].pow(0.5))
    if (knowledgeUpgrade2Effect.gt(1e20)) knowledgeUpgrade2Effect = knowledgeUpgrade2Effect.mul(1e60).pow(0.25)
    if (knowledgeUpgrade2Effect.gt("e2e7")) knowledgeUpgrade2Effect = new Decimal("e2e7")
    u = u.pow(knowledgeUpgrade2Effect)
  }
  if (state.voidMagicUpgradesBought[12] === true) u = u.pow(1e30)
  if (state.unlocks >= 34 && state.deathEssenceUpgradesBought[2].gt(0)) {
    let dea3 = new Decimal(2).pow(state.deathEssenceUpgradesBought[2].pow(0.7)).mul(10000)
    if (dea3.gt(500000)) dea3 = dea3.mul(500000).pow(0.5)
    if (dea3.gt(1e9)) dea3 = new Decimal(1e9)
    dea3 = new Decimal(10).pow(dea3)
    u = u.pow(dea3)
  }
  if (state.inHell) {
    if (state.currentHellLayer == 1) u = u.pow(0.1)
    else if (state.currentHellLayer == 2) u = u.pow(0.01)
    else if (state.currentHellLayer == 3 || state.currentHellLayer == 4) u = u.add(1).log10()
    else if (state.currentHellLayer == 5) u = u.add(1).log10().pow(0.5)
  }
  return u.floor()
}

window.uraniumLogic.extraUraniumPerSecond = s => Decimal.max(s.bestUraniumToGet.div(10), 1)

