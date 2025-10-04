function produceGold() {
  game.gold = game.gold.add(game.goldPerClick)
}

function buyMiner() {
  if (game.gold.gte(game.minerCost)) {
    //Subtracts gold based on cost, adds a miner, updates the cost
    if (game.gold.lt("e1e9")) game.gold = Decimal.max(game.gold.sub(game.minerCost), 0)
    game.miners = game.miners.add(1)

    // Use extracted logic from goldLogic.js
    game.minerCost = window.goldLogic.calculateMinerCost(game.miners, game.platinumUpgradesBought)

    if (window.ui && window.ui.update) {
      window.ui.update.setText('minerCost', format(game.minerCost, 0))
      window.ui.update.showResourceRow(1)
    } else {
      document.getElementById("minerCost").textContent = format(game.minerCost, 0)
      document.getElementsByClassName("resourceRow")[1].style.display = "block"
    }
  }
}

function buyMaxMiners() {
  if (game.gold.gte(game.minerCost)) {
    //Determines the amount of miners the user can afford and the price, subtracts gold, adds miners, updates the cost
    BMamountCanBuy = Decimal.affordGeometricSeries(game.gold, 20, new Decimal(1.1).sub(game.platinumUpgradesBought[3] * 0.005), game.miners)
    BMCost = Decimal.sumGeometricSeries(BMamountCanBuy, 20, new Decimal(1.1).sub(game.platinumUpgradesBought[3] * 0.005), game.miners)
    if (BMCost.lt("e1e9")) game.gold = Decimal.max(game.gold.sub(BMCost), 0)
    //game.gold = game.gold.sub(BMCost)
    game.miners = game.miners.add(BMamountCanBuy)

    // Use extracted logic from goldLogic.js
    game.minerCost = window.goldLogic.calculateMinerCost(game.miners, game.platinumUpgradesBought)

    if (window.ui && window.ui.update) {
      window.ui.update.setText('minerCost', format(game.minerCost, 0))
      window.ui.update.showResourceRow(1)
    } else {
      document.getElementById("minerCost").textContent = format(game.minerCost, 0)
      document.getElementsByClassName("resourceRow")[1].style.display = "block"
    }
  }
}


function minerAutoBuyMax() {
  if (!game.minerAutoBuyMax) {
    game.minerAutoBuyMax = true
    if (window.ui && window.ui.update) window.ui.update.setHTML('minerAutoBuyMaxButton', 'Auto buy max: On')
    else document.getElementById("minerAutoBuyMaxButton").innerHTML = "Auto buy max: On"
  }
  else {
    game.minerAutoBuyMax = false
    if (window.ui && window.ui.update) window.ui.update.setHTML('minerAutoBuyMaxButton', 'Auto buy max: Off')
    else document.getElementById("minerAutoBuyMaxButton").innerHTML = "Auto buy max: Off"
  }
}
