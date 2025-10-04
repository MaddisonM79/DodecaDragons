/**
 * Pure Holy Fire calculation logic
 */
window.holyFireLogic = window.holyFireLogic || {}

window.holyFireLogic.calculateHolyFirePerSecond = function(state) {
  const {
    blueFire, holyFireUpgradesBought, holyTetrahedronUpgradesBought,
    holyOctahedronUpgradesBought, holyDodecahedronUpgradesBought,
    holyOctahedrons, holyDodecahedrons, dragonStage, unlocks,
    planetEffect, plagueUpgradesBought, finalityEssenceUpgradesBought
  } = state

  let per = blueFire.add(1).log10().div(100)
  per = per.mul(new Decimal(2).pow(holyFireUpgradesBought[0].pow(0.6)))
  if (holyTetrahedronUpgradesBought[12]) per = per.mul(100)
  if (holyOctahedronUpgradesBought[7]) per = per.mul(holyOctahedrons.add(1))
  if (holyDodecahedronUpgradesBought[5]) per = per.mul(holyDodecahedrons.add(1))
  if (dragonStage >= 8) per = per.mul(1e10)
  if (unlocks >= 29) per = per.pow(planetEffect)
  if (unlocks >= 31) per = per.pow(plagueUpgradesBought[3].pow(0.5).div(10).add(1))
  if (unlocks >= 36) per = per.pow(new Decimal(1.1).pow(finalityEssenceUpgradesBought[1].pow(0.5)))
  return per
}

// Upgrade effect helpers with softcap flags
window.holyFireLogic.upg1Effect = s => new Decimal(2).pow(s.holyFireUpgradesBought[0].pow(0.6))

window.holyFireLogic.upg2Effect = function(s) {
  let eff = new Decimal(3).pow(s.holyFireUpgradesBought[1].pow(0.6))
  let status = 'none'
  if (eff.gt('1e2000')) {
    eff = eff.mul('1e2000').pow(0.5)
    status = 'softcapped'
    if (eff.gt('1e10000')) {
      eff = new Decimal('1e10000')
      status = 'hardcapped'
    }
  }
  return { eff, status }
}

window.holyFireLogic.upg3Effect = s => s.holyFireUpgradesBought[2].pow(0.7).mul(5).add(1)
window.holyFireLogic.upg4Effect = s => s.holyFireUpgradesBought[3].pow(0.6).mul(2.5).add(1)
window.holyFireLogic.upg5Effect = s => new Decimal(2).pow(s.holyFireUpgradesBought[4].pow(0.6))

window.holyFireLogic.upg6Effect = function(s) {
  let eff = new Decimal(2).pow(s.holyFireUpgradesBought[5].pow(0.7))
  let status = 'none'
  if (eff.gt('1e2000')) {
    eff = eff.mul('1e2000').pow(0.5)
    status = 'softcapped'
    if (eff.gt('1e10000')) {
      eff = new Decimal('1e10000')
      status = 'hardcapped'
    }
  }
  return { eff, status }
}

