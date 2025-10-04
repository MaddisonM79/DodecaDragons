/**
 * Knowledge reward calculation logic for DodecaDragons
 * Pure function for calculating knowledge rewards from cyan sigils
 */

/**
 * Calculate knowledge reward from ideal trade level
 * This is a complex formula with many multipliers from various upgrades
 * @param {object} game - Game state object
 * @returns {object} Object with knowledge reward amount and per-second display
 */
function calculateKnowledgeReward(game) {
  if (game.unlockedAchievements[15] <= 0) {
    return {
      knowledgeReward: new Decimal(0),
      knowledgePerSecond: ""
    }
  }

  // Calculate ideal trade level
  const idealTradeLevel = (game.cyanSigils.div(500000)).log10().div(0.178)

  // Base reward from ideal trade level
  let knowledgeRewardTemp = new Decimal(1.5).pow(idealTradeLevel.sub(1))

  // Apply knowledge upgrade 0 multiplier
  knowledgeRewardTemp = knowledgeRewardTemp.mul(new Decimal(2).pow(game.knowledgeUpgradesBought[0].pow(0.5)))

  // Tome upgrade 2 multiplier (×2)
  if (game.tomeUpgradesBought[2] == true) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul(2)
  }

  // Tome upgrade 6 multiplier (total tomes)
  if (game.tomeUpgradesBought[6] == true) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul(game.totalTomes.pow(1.2).add(1))
  }

  // Tome upgrade 8 multiplier (blue fire upgrade 5)
  if (game.tomeUpgradesBought[8] == true) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul(new Decimal(1000).pow(game.blueFireUpgradesBought[5].pow(0.6)))
  }

  // Holy tetrahedron upgrade 7 multiplier (×1e150)
  if (game.holyTetrahedronUpgradesBought[7]) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul(1e150)
  }

  // Holy octahedron upgrade 8 multiplier (×e550)
  if (game.holyOctahedronUpgradesBought[8]) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul("e550")
  }

  // Void magic upgrade 11 multiplier (×e12000)
  if (game.voidMagicUpgradesBought[11] == true) {
    knowledgeRewardTemp = knowledgeRewardTemp.mul("e12000")
  }

  // Dark essence upgrade 2 multiplier (complex formula)
  if (game.unlocks >= 33 && game.darkEssenceUpgradesBought[2].gt(0)) {
    const darkEssenceMultiplier = new Decimal(10).pow(
      new Decimal(2).pow(game.darkEssenceUpgradesBought[2].pow(0.5)).mul(5e9)
    )
    knowledgeRewardTemp = knowledgeRewardTemp.mul(darkEssenceMultiplier)
  }

  // Final division and floor
  knowledgeRewardTemp = knowledgeRewardTemp.div(2).floor()

  return {
    knowledgeReward: knowledgeRewardTemp,
    knowledgePerSecond: " (" + window.formatUtils.format(knowledgeRewardTemp, 0) + "/s)"
  }
}

/**
 * Apply knowledge reward to game state
 * @param {object} game - Game state object
 * @param {Decimal} knowledgeReward - Knowledge reward amount to add
 * @returns {object} Updated knowledge and highestKnowledge values
 */
function applyKnowledgeReward(game, knowledgeReward) {
  const newKnowledge = game.knowledge.add(knowledgeReward)
  const newHighest = newKnowledge.gte(game.highestKnowledge) ? newKnowledge : game.highestKnowledge

  return {
    knowledge: newKnowledge,
    highestKnowledge: newHighest
  }
}

// Additional helpers for knowledge-related displays
function calculateKnowledgeTradeLevelCap(state) {
  return Decimal.min(state.highestKnowledge.add(1).log2().mul(1.6).add(3).floor(), 9999)
}

function calculateKnowledgeSigilBoost(state) {
  return state.highestKnowledge.div(3).pow(0.7).add(1)
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.knowledgeLogic = {
    calculateKnowledgeReward,
    applyKnowledgeReward,
    calculateKnowledgeTradeLevelCap,
    calculateKnowledgeSigilBoost
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateKnowledgeReward,
    applyKnowledgeReward,
    calculateKnowledgeTradeLevelCap,
    calculateKnowledgeSigilBoost
  }
}
