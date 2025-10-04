/**
 * Pure sigils/magifolds logic
 */
window.sigilsLogic = window.sigilsLogic || {}

/** Calculate magifolds from scores, respecting hell */
window.sigilsLogic.calculateMagifolds = function(state) {
  const { inHell, magicScore1, magicScore2, magicScore3, magicScore4 } = state
  if (inHell) return new Decimal(1)
  return magicScore1.add(1).mul(magicScore2.add(1)).mul(magicScore3.add(1)).mul(magicScore4.add(1))
}

/** Calculate displayed magifold effect based on upgrades */
window.sigilsLogic.calculateMagifoldEffect = function(state, magifolds) {
  const { violetSigilUpgradesBought, darkMagicUpgradesBought, magicUpgradesBought } = state
  if (violetSigilUpgradesBought[2].eq(1)) return magifolds.pow(magifolds.add(10).log10().log10().add(8))
  if (darkMagicUpgradesBought[3]) return magifolds.pow(8)
  if (magicUpgradesBought[18]) return magifolds.pow(6)
  return magifolds.pow(4)
}

/** Calculate magic score to get upon exiting challenges */
window.sigilsLogic.calculateMagicScoreToGet = function(state) {
  const {
    gold, fire, magicUpgradesBought, magifolds, unlocks,
    uraniumUpgradesBought, darkMagicUpgradesBought, holyTetrahedronUpgradesBought,
    holyOctahedronUpgradesBought, pinkSigils, pinkSigilUpgradesBought,
    cyanSigils, blueSigils, indigoSigils, violetSigils, redSigils, orangeSigils, yellowSigils
  } = state

  let score = gold.add(1).multiply(fire.add(1)).log10()
  if (magicUpgradesBought[12]) score = score.mul(2)
  if (magicUpgradesBought[16]) score = score.mul(magifolds.log10().add(1).div(3))
  if (unlocks >= 7) score = score.mul(2 ** uraniumUpgradesBought[2])
  if (darkMagicUpgradesBought[6]) score = score.mul(2)
  if (unlocks >= 10) score = score.mul(cyanSigils.add(1).pow(2))
  if (unlocks >= 11) score = score.mul(blueSigils.add(1).pow(3))
  if (unlocks >= 13) score = score.mul(violetSigils.add(1).pow(5))
  if (unlocks >= 21) score = score.mul(new Decimal(10).pow(redSigils.pow(0.5).mul(400)))
  if (unlocks >= 22) score = score.mul(new Decimal(10).pow(orangeSigils.pow(0.5).mul(800)))
  if (unlocks >= 23) score = score.mul(new Decimal(10).pow(yellowSigils.pow(0.5).mul(1600)))
  if (unlocks >= 14) {
    score = score.mul(pinkSigils.add(1).pow(6))
    score = score.pow(new Decimal(1.5).pow(pinkSigilUpgradesBought[2].pow(0.5)))
  }
  if (darkMagicUpgradesBought[0]) score = score.pow(1.3)
  if (holyTetrahedronUpgradesBought[1]) score = score.pow(2)
  if (holyOctahedronUpgradesBought[5]) score = score.pow(100)
  return score.floor()
}

// --- Per-colour helpers ---

function dragonPetBoost(state) {
  return new Decimal(5).pow(Math.sqrt(state.dragonPets || 0))
}

function knowledgeBoost(state) {
  return state.highestKnowledge.div(3).pow(0.7).add(1)
}

function plutoniumBoost(state) {
  return state.plutonium.add(1).pow(0.5).mul(10).pow(state.plutoniumUpgradesBought[2] || 0)
}

// Cyan
window.sigilsLogic.calculateCyanSigils = function(state) {
  const baseDiv = new Decimal(3000).sub(state.blueSigilUpgradesBought[2].mul(100))
  let toGet = state.gold.add(1).log10().div(baseDiv).floor()
  const nextAt = new Decimal(10).pow(toGet.add(1).mul(baseDiv))
  if (state.darkMagicUpgradesBought[8] === true) toGet = toGet.mul(3)
  toGet = toGet.mul(dragonPetBoost(state))
  if (state.unlocks >= 15) toGet = toGet.mul(knowledgeBoost(state))
  if (state.unlocks >= 18) toGet = toGet.mul(state.blood.pow(2).add(1))
  if ((state.plutoniumUpgradesBought[2] || 0) > 0) toGet = toGet.mul(plutoniumBoost(state))
  if (state.holyTetrahedronUpgradesBought[2]) toGet = toGet.mul(1e50)
  if (state.unlocks >= 34 && state.deathEssenceUpgradesBought[1].gt(0)) {
    toGet = toGet.mul(new Decimal(10).pow(new Decimal(2).pow(state.deathEssenceUpgradesBought[1].pow(0.5)).mul(1e10)))
  }
  return { toGet: toGet.round(), nextAt }
}

window.sigilsLogic.calculateCyanPowerPerSecond = function(state) {
  let pps = state.cyanSigils.pow(2).div(100).mul(state.cyanSigilUpgradesBought[0].add(1))
  if (state.unlocks >= 12) pps = pps.pow(Decimal.min(new Decimal(1.15).pow(state.indigoSigilUpgradesBought[1].pow(0.5)), 30))
  if (state.voidMagicUpgradesBought[2]) pps = pps.pow(2)
  return pps
}

// Blue
window.sigilsLogic.calculateBlueSigils = function(state) {
  let toGet = state.gold.add(1).log10().div(8000).floor()
  const nextAt = new Decimal(10).pow(toGet.add(1).mul(8000))
  if (state.darkMagicUpgradesBought[8] === true) toGet = toGet.mul(3)
  toGet = toGet.mul(dragonPetBoost(state))
  if (state.unlocks >= 15) toGet = toGet.mul(knowledgeBoost(state))
  if (state.unlocks >= 18) toGet = toGet.mul(state.blood.pow(2).add(1))
  if ((state.plutoniumUpgradesBought[2] || 0) > 0) toGet = toGet.mul(plutoniumBoost(state))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateBluePowerPerSecond = function(state) {
  let pps = state.blueSigils.pow(2).div(100).mul(state.blueSigilUpgradesBought[0].add(1))
  if (state.unlocks >= 13) pps = pps.pow(new Decimal(1.3).pow(state.violetSigilUpgradesBought[1].pow(0.5)))
  return pps
}

// Indigo
window.sigilsLogic.calculateIndigoSigils = function(state) {
  let toGet = state.gold.add(1).log10().div(16000).floor()
  const nextAt = new Decimal(10).pow(toGet.add(1).mul(16000))
  toGet = toGet.mul(dragonPetBoost(state))
  if (state.unlocks >= 15) toGet = toGet.mul(knowledgeBoost(state))
  if (state.unlocks >= 18) toGet = toGet.mul(state.blood.pow(2).add(1))
  if ((state.plutoniumUpgradesBought[2] || 0) > 0) toGet = toGet.mul(plutoniumBoost(state))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateIndigoPowerPerSecond = function(state) {
  let pps = state.indigoSigils.pow(2).div(100).mul(state.indigoSigilUpgradesBought[0].add(1))
  if (state.tomeUpgradesBought[0]) pps = pps.pow(1.3)
  return pps
}

// Violet
window.sigilsLogic.calculateVioletSigils = function(state) {
  let toGet = state.gold.add(1).log10().div(30000).floor()
  const nextAt = new Decimal(10).pow(toGet.add(1).mul(30000))
  toGet = toGet.mul(dragonPetBoost(state))
  if (state.unlocks >= 15) toGet = toGet.mul(knowledgeBoost(state))
  if (state.unlocks >= 18) toGet = toGet.mul(state.blood.pow(2).add(1))
  if ((state.plutoniumUpgradesBought[2] || 0) > 0) toGet = toGet.mul(plutoniumBoost(state))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateVioletPowerPerSecond = function(state) {
  return state.violetSigils.pow(2).div(100).mul(state.violetSigilUpgradesBought[0].add(1))
}

// Pink
window.sigilsLogic.calculatePinkSigils = function(state) {
  let toGet = state.gold.add(1).log10().div(300000).floor()
  const nextAt = new Decimal(10).pow(toGet.add(1).mul(300000))
  toGet = toGet.mul(dragonPetBoost(state))
  if (state.unlocks >= 15) toGet = toGet.mul(knowledgeBoost(state))
  if (state.unlocks >= 18) toGet = toGet.mul(state.blood.pow(2).add(1))
  if ((state.plutoniumUpgradesBought[2] || 0) > 0) toGet = toGet.mul(plutoniumBoost(state))
  if (state.holyTetrahedronUpgradesBought[8]) toGet = toGet.pow(2)
  if (state.unlocks >= 33) toGet = toGet.pow(new Decimal(1.1).pow(state.lightEssenceUpgradesBought[2].pow(0.5)))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculatePinkPowerPerSecond = function(state) {
  let pps = state.pinkSigils.pow(2).div(100).mul(state.pinkSigilUpgradesBought[0].add(1))
  if (state.tomeUpgradesBought[1]) pps = pps.mul(state.totalTomes.pow(0.5).mul(3).add(1))
  return pps
}

// Red
window.sigilsLogic.calculateRedSigils = function(state) {
  let toGet = Decimal.max(state.gold.add(10).log10().log10().sub(20).floor(), 0)
  const nextAt = new Decimal(10).pow(new Decimal(10).pow(toGet.add(21)))
  if (state.darkMagicUpgradesBought[15]) toGet = toGet.mul(state.blueFire.add(1).log10().div(10).add(1))
  if (state.unlocks >= 22) toGet = toGet.mul(state.orangeSigilUpgradesBought[1].pow(0.5).mul(2).add(1))
  if (state.holyTetrahedronUpgradesBought[3]) toGet = toGet.mul(10)
  if (state.holyOctahedronUpgradesBought[0]) toGet = toGet.mul(state.holyTetrahedrons.add(1))
  if (state.holyDodecahedronUpgradesBought[0]) toGet = toGet.mul(state.holyOctahedrons.add(1))
  if (state.holyDodecahedronUpgradesBought[3]) toGet = toGet.mul(1e20)
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateRedPowerPerSecond = function(state) {
  return state.redSigils.pow(2).div(100).mul(state.redSigilUpgradesBought[0].add(1))
}

// Orange
window.sigilsLogic.calculateOrangeSigils = function(state) {
  let toGet = Decimal.max(state.gold.add(10).log10().log10().sub(21).div(2).floor(), 0)
  const nextAt = new Decimal(10).pow(new Decimal(10).pow(toGet.mul(2).add(23)))
  if (state.darkMagicUpgradesBought[16]) toGet = toGet.mul(state.blood.add(1).log10().div(2).add(1))
  if (state.unlocks >= 23) toGet = toGet.mul(state.yellowSigilUpgradesBought[1].pow(0.5).mul(2).add(1))
  if (state.holyTetrahedronUpgradesBought[3]) toGet = toGet.mul(10)
  if (state.holyOctahedronUpgradesBought[0]) toGet = toGet.mul(state.holyTetrahedrons.add(1))
  if (state.holyDodecahedronUpgradesBought[0]) toGet = toGet.mul(state.holyOctahedrons.add(1))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateOrangePowerPerSecond = function(state) {
  let pps = state.orangeSigils.pow(2).div(100).mul(state.orangeSigilUpgradesBought[0].add(1))
  if (state.voidMagicUpgradesBought[1]) pps = pps.mul(1e20)
  return pps
}

// Yellow
window.sigilsLogic.calculateYellowSigils = function(state) {
  let toGet = Decimal.max(state.gold.add(10).log10().log10().sub(22).div(3).floor(), 0)
  const nextAt = new Decimal(10).pow(new Decimal(10).pow(toGet.mul(3).add(25)))
  if (state.darkMagicUpgradesBought[17]) toGet = toGet.mul(state.plutonium.add(1).log10().add(1))
  if (state.holyTetrahedronUpgradesBought[3]) toGet = toGet.mul(10)
  if (state.holyOctahedronUpgradesBought[0]) toGet = toGet.mul(state.holyTetrahedrons.add(1))
  if (state.holyDodecahedronUpgradesBought[0]) toGet = toGet.mul(state.holyOctahedrons.add(1))
  return { toGet: toGet.round(), nextAt }
}
window.sigilsLogic.calculateYellowPowerPerSecond = function(state) {
  let pps = state.yellowSigils.pow(2).div(100).mul(state.yellowSigilUpgradesBought[0].add(1))
  if (state.darkMagicUpgradesBought[19]) pps = pps.mul(1000)
  return pps
}

// --- Upgrade effect helpers (for UI text) ---

// Cyan
window.sigilsLogic.cyanUpgrade1Effect = s => s.cyanSigilUpgradesBought[0].add(1)
window.sigilsLogic.cyanUpgrade2Effect = s => s.cyanSigilUpgradesBought[1].add(1).pow(1.5)
window.sigilsLogic.cyanUpgrade3Effect = s => new Decimal(1.2).pow(s.cyanSigilUpgradesBought[2].pow(0.4))

// Blue
window.sigilsLogic.blueUpgrade1Effect = s => s.blueSigilUpgradesBought[0].add(1)
window.sigilsLogic.blueUpgrade2Effect = s => new Decimal(1e15).pow(s.blueSigilUpgradesBought[1].pow(0.6))

// Indigo
window.sigilsLogic.indigoUpgrade1Effect = s => s.indigoSigilUpgradesBought[0].add(1)
window.sigilsLogic.indigoUpgrade2Effect = s => Decimal.min(new Decimal(1.15).pow(s.indigoSigilUpgradesBought[1].pow(0.5)), 30)
window.sigilsLogic.indigoUpgrade3Effect = s => new Decimal(2).pow(s.indigoSigilUpgradesBought[2].pow(0.6))

// Violet
window.sigilsLogic.violetUpgrade1Effect = s => s.violetSigilUpgradesBought[0].add(1)
window.sigilsLogic.violetUpgrade2Effect = s => new Decimal(1.3).pow(s.violetSigilUpgradesBought[1].pow(0.5))

// Pink
window.sigilsLogic.pinkUpgrade1Effect = s => s.pinkSigilUpgradesBought[0].add(1)
window.sigilsLogic.pinkUpgrade3Effect = s => new Decimal(1.5).pow(s.pinkSigilUpgradesBought[2].pow(0.5))

// Red
window.sigilsLogic.redUpgrade1Effect = s => s.redSigilUpgradesBought[0].add(1)
window.sigilsLogic.redUpgrade2Effect = s => new Decimal(50).pow(s.redSigilUpgradesBought[1].pow(0.8))
window.sigilsLogic.redUpgrade3Effect = s => new Decimal(6).pow(s.redSigilUpgradesBought[2].pow(0.7))

// Orange
window.sigilsLogic.orangeUpgrade1Effect = s => s.orangeSigilUpgradesBought[0].add(1)
window.sigilsLogic.orangeUpgrade2Effect = s => s.orangeSigilUpgradesBought[1].pow(0.5).mul(2).add(1)
window.sigilsLogic.orangeUpgrade3Effect = s => new Decimal(6).pow(s.orangeSigilUpgradesBought[2].pow(0.7))

// Yellow
window.sigilsLogic.yellowUpgrade1Effect = s => s.yellowSigilUpgradesBought[0].add(1)
window.sigilsLogic.yellowUpgrade2Effect = s => s.yellowSigilUpgradesBought[1].pow(0.5).mul(2).add(1)
window.sigilsLogic.yellowUpgrade3Effect = s => new Decimal(15).pow(s.yellowSigilUpgradesBought[2].pow(0.5))
