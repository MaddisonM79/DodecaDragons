/**
 * Pure Blue Fire calculation logic
 */
window.blueFireLogic = window.blueFireLogic || {}

window.blueFireLogic.calculateBlueFirePerSecond = function(state) {
  const {
    fire, blueFireUpgradesBought, dragonStage, tomeUpgradesBought,
    totalTomes, darkMagicUpgradesBought, blood, plutonium,
    plutoniumUpgradesBought, unlocks, redSigilUpgradesBought,
    holyOctahedronUpgradesBought, holyTetrahedronUpgradesBought,
    oganesson, oganessonUpgradesBought, planetEffect, plagueUpgradesBought
  } = state

  let per = fire.add(1).log10().div(10000)
  per = per.mul(new Decimal(2).pow(blueFireUpgradesBought[0].pow(0.6)))
  if (dragonStage >= 6) per = per.mul(100)
  if (tomeUpgradesBought[9]) per = per.mul(totalTomes.pow(0.6))
  if (darkMagicUpgradesBought[10]) per = per.mul(blood.add(1))
  if ((plutoniumUpgradesBought[3] || 0) > 0) per = per.mul(1.5 ** plutoniumUpgradesBought[3])
  if ((plutoniumUpgradesBought[4] || 0) > 0) per = per.mul(1.25 ** plutoniumUpgradesBought[4])
  if (unlocks >= 21) per = per.mul(new Decimal(50).pow(redSigilUpgradesBought[1].pow(0.8)))
  if (dragonStage >= 7) per = per.mul(1e50)
  if (holyOctahedronUpgradesBought[3]) per = per.mul(1e250)
  if (holyTetrahedronUpgradesBought[6]) per = per.mul(plutonium.pow(0.5).add(1))
  if (holyTetrahedronUpgradesBought[0]) per = per.pow(2)
  if (unlocks >= 29) per = per.pow(planetEffect)
  if (unlocks >= 31) per = per.pow(plagueUpgradesBought[2].pow(0.5).mul(10).add(1))
  if (unlocks >= 32) per = per.pow(oganesson.log10().div(10).add(1).pow(oganessonUpgradesBought[4] || 0))
  return per
}

// Upgrade effect helpers (for UI labels)
window.blueFireLogic.upg1Effect = s => new Decimal(2).pow(s.blueFireUpgradesBought[0].pow(0.6))
window.blueFireLogic.upg2Effect = s => s.blueFireUpgradesBought[1].add(1).log10().div(4).add(1)
window.blueFireLogic.upg3Effect = s => s.blueFireUpgradesBought[2].add(1).log2().add(1)
window.blueFireLogic.upg4Effect = s => s.blueFireUpgradesBought[3].pow(0.7).mul(5).add(1)
window.blueFireLogic.upg5Effect = s => s.blueFireUpgradesBought[4].pow(0.7).div(5).add(1)
window.blueFireLogic.upg6Effect = s => new Decimal(1000).pow(s.blueFireUpgradesBought[5].pow(0.6))

