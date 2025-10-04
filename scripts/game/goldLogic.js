/**
 * Pure gold calculation logic - no DOM, no side effects
 * All functions are testable and reusable
 */

// Create global namespace for gold logic
window.goldLogic = window.goldLogic || {};

/**
 * Calculate gold per second based on game state
 * @param {Object} state - Game state object
 * @returns {Decimal} Gold per second value
 */
window.goldLogic.calculateGoldPerSecond = function(state) {
  const {
    miners, fire, unlocks, darkMagicUpgradesBought, magicUpgradesBought,
    fireUpgrade2Bought, fireUpgrade4Bought, platinumUpgradesBought,
    platinumUpgrade6Effect, challengesActive, selectedChallenges,
    magicEffect, gold, magifolds, violetSigilUpgradesBought,
    dragonStage, dragonTimeEffect, cyanSigilUpgradesBought,
    tomeUpgradesBought, platinum, holyDodecahedronUpgradesBought,
    redSigils, inHell, currentHellLayer, holyOctahedronUpgradesBought,
    blood
  } = state

  // Base calculation
  let goldPerSecond = miners.mul(fire.div(10).add(1).log10().mul(2).add(1))

  // Unlock 2+ modifiers
  if (unlocks >= 2) {
    if (darkMagicUpgradesBought[5]) {
      goldPerSecond = goldPerSecond.mul(new Decimal(5).pow(fireUpgrade2Bought.pow(0.8)))
    } else if (magicUpgradesBought[8]) {
      goldPerSecond = goldPerSecond.mul(new Decimal(1.6).pow(fireUpgrade2Bought.pow(0.8)))
    } else {
      goldPerSecond = goldPerSecond.mul(new Decimal(1.25).pow(fireUpgrade2Bought.pow(0.8)))
    }

    if (platinumUpgradesBought[8] > 0) {
      goldPerSecond = goldPerSecond.mul(fireUpgrade4Bought.pow(miners.pow(0.3)).pow(platinumUpgradesBought[8] / 4).add(1))
    } else {
      goldPerSecond = goldPerSecond.mul(fireUpgrade4Bought.pow(1.5).mul(miners).div(50).add(1))
    }
  }

  // Unlock 3+ modifiers
  if (unlocks >= 3) {
    goldPerSecond = goldPerSecond.mul(1 + platinumUpgradesBought[0] * 0.2)
  }

  if (platinumUpgradesBought[5] > 0) {
    goldPerSecond = goldPerSecond.mul(platinumUpgrade6Effect)
  }

  if (challengesActive && selectedChallenges[3]) {
    goldPerSecond = goldPerSecond.div(1e25)
  }

  // Unlock 4+ modifiers
  if (unlocks >= 4) {
    goldPerSecond = goldPerSecond.mul(magicEffect)
  }

  if (magicUpgradesBought[0]) {
    goldPerSecond = goldPerSecond.mul(gold.add(1).log10().add(1))
  }

  if (magicUpgradesBought[2]) {
    goldPerSecond = goldPerSecond.mul(55.5)
  }

  if (magicUpgradesBought[5]) {
    if (magicUpgradesBought[9]) {
      goldPerSecond = goldPerSecond.mul(miners.pow(3).add(1))
    } else {
      goldPerSecond = goldPerSecond.mul(miners.pow(1.5).add(1))
    }
  }

  // Unlock 5+ modifiers (magifolds)
  if (unlocks >= 5) {
    if (violetSigilUpgradesBought[2].eq(1)) {
      goldPerSecond = goldPerSecond.mul(magifolds.pow(magifolds.add(10).log10().log10().add(8)))
    } else if (darkMagicUpgradesBought[3]) {
      goldPerSecond = goldPerSecond.mul(magifolds.pow(8))
    } else if (magicUpgradesBought[18]) {
      goldPerSecond = goldPerSecond.mul(magifolds.pow(6))
    } else {
      goldPerSecond = goldPerSecond.mul(magifolds.pow(4))
    }
  }

  // Dragon stage modifiers
  if (dragonStage >= 5) {
    goldPerSecond = goldPerSecond.pow(dragonTimeEffect)
  }

  // Unlock 10+ modifiers
  if (unlocks >= 10) {
    if (!inHell || currentHellLayer < 2) {
      goldPerSecond = goldPerSecond.pow(new Decimal(1.2).pow(cyanSigilUpgradesBought[2].pow(0.4)))
    }
  }

  if (tomeUpgradesBought[3]) {
    goldPerSecond = goldPerSecond.pow(platinum.add(1e10).slog().div(2))
  }

  if (holyDodecahedronUpgradesBought[4]) {
    goldPerSecond = goldPerSecond.pow(redSigils.pow(0.2).add(1))
  }

  // Challenge modifiers
  if (challengesActive && selectedChallenges[1]) {
    goldPerSecond = goldPerSecond.pow(0.25)
  }

  // Hell layer modifiers
  if (inHell) {
    if (currentHellLayer == 1) {
      goldPerSecond = goldPerSecond.add(1).log10().pow(5)
    } else if (currentHellLayer == 2) {
      goldPerSecond = goldPerSecond.add(1).log10().pow(2)
    } else if (currentHellLayer == 3) {
      goldPerSecond = goldPerSecond.add(1).log10()
    } else if (currentHellLayer == 4) {
      goldPerSecond = goldPerSecond.add(1).log10().pow(0.5)
    } else if (currentHellLayer == 5) {
      goldPerSecond = goldPerSecond.add(1).log10().pow(0.2)
    }

    if (holyOctahedronUpgradesBought[1]) {
      goldPerSecond = goldPerSecond.mul(1e250)
    }

    if (tomeUpgradesBought[10]) {
      goldPerSecond = goldPerSecond.pow(blood.add(1).log10().add(1))
    }
  }

  return goldPerSecond
}

/**
 * Calculate gold per click based on game state
 * @param {Object} state - Game state object
 * @returns {Decimal} Gold per click value
 */
window.goldLogic.calculateGoldPerClick = function(state) {
  const {
    magicUpgradesBought, fireUpgrade3Bought, unlocks, magicEffect,
    gold, magifolds, violetSigilUpgradesBought, darkMagicUpgradesBought,
    dragonStage, dragonTimeEffect, challengesActive, selectedChallenges,
    inHell, currentHellLayer, holyOctahedronUpgradesBought,
    tomeUpgradesBought, blood
  } = state

  // Base calculation
  let goldPerClick
  if (magicUpgradesBought[8]) {
    goldPerClick = fireUpgrade3Bought.pow(12).mul(4).add(1)
  } else {
    goldPerClick = fireUpgrade3Bought.pow(2.6).mul(4).add(1)
  }

  // Magic effect
  if (unlocks >= 4) {
    goldPerClick = goldPerClick.mul(magicEffect)
  }

  if (magicUpgradesBought[0]) {
    goldPerClick = goldPerClick.mul(gold.add(1).log10().add(1))
  }

  if (magicUpgradesBought[2]) {
    goldPerClick = goldPerClick.mul(55.5)
  }

  // Magifolds
  if (unlocks >= 5) {
    if (violetSigilUpgradesBought[2].eq(1)) {
      goldPerClick = goldPerClick.mul(magifolds.pow(magifolds.add(10).log10().log10().add(8)))
    } else if (darkMagicUpgradesBought[3]) {
      goldPerClick = goldPerClick.mul(magifolds.pow(8))
    } else if (magicUpgradesBought[18]) {
      goldPerClick = goldPerClick.mul(magifolds.pow(6))
    } else {
      goldPerClick = goldPerClick.mul(magifolds.pow(4))
    }
  }

  // Dragon stage
  if (dragonStage >= 5) {
    goldPerClick = goldPerClick.pow(dragonTimeEffect)
  }

  // Challenges
  if (challengesActive && selectedChallenges[1]) {
    goldPerClick = goldPerClick.pow(0.25)
  }

  if (challengesActive && selectedChallenges[3]) {
    goldPerClick = new Decimal(20)
  }

  // Hell layers
  if (inHell) {
    if (currentHellLayer == 1) {
      goldPerClick = goldPerClick.add(1).log10().pow(5)
    } else if (currentHellLayer == 2) {
      goldPerClick = goldPerClick.add(1).log10().pow(2)
    } else if (currentHellLayer == 3) {
      goldPerClick = goldPerClick.add(1).log10()
    } else if (currentHellLayer == 4) {
      goldPerClick = goldPerClick.add(1).log10().pow(0.5)
    } else if (currentHellLayer == 5) {
      goldPerClick = goldPerClick.add(1).log10().pow(0.2)
    }

    if (holyOctahedronUpgradesBought[1]) {
      goldPerClick = goldPerClick.mul(1e250)
    }

    if (tomeUpgradesBought[10]) {
      goldPerClick = goldPerClick.pow(blood.add(1).log10().add(1))
    }
  }

  return goldPerClick
}

/**
 * Calculate miner cost based on current miners and upgrades
 * @param {Decimal} currentMiners - Current number of miners
 * @param {Array} platinumUpgradesBought - Platinum upgrades array
 * @returns {Decimal} Miner cost
 */
window.goldLogic.calculateMinerCost = function(currentMiners, platinumUpgradesBought) {
  return new Decimal(1.1)
    .sub(platinumUpgradesBought[3] * 0.005)
    .pow(currentMiners)
    .mul(20)
    .floor()
}

/**
 * Check if player can afford a miner
 * @param {Decimal} gold - Current gold
 * @param {Decimal} minerCost - Cost of miner
 * @returns {boolean} Can afford
 */
window.goldLogic.canAffordMiner = function(gold, minerCost) {
  return gold.gte(minerCost)
}
