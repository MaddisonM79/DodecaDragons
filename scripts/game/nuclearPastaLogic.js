/**
 * Nuclear Pasta logic
 * Pure helpers for computing nuclear pasta state effects.
 */
(function(){
  if (!window.nuclearPastaLogic) window.nuclearPastaLogic = {}

  /**
   * Calculate the displayed effect value for the current nuclear pasta state.
   * Returns a Decimal (or null if state invalid).
   * Does not format or touch the DOM.
   */
  window.nuclearPastaLogic.calculateEffect = function(state) {
    const np = state.nuclearPasta
    switch (state.nuclearPastaState) {
      case 1:
        return Decimal.min(new Decimal(3).pow(np.pow(0.7)), 1e75)
      case 2:
        return Decimal.min(new Decimal(2.5).pow(np.pow(0.6)), 1e7)
      case 3:
        return Decimal.min(new Decimal(10).pow(np.pow(0.7)), new Decimal('1e1500'))
      case 4:
        return Decimal.min(new Decimal(0.02).mul(np.pow(0.6)).add(1), 1.3)
      case 5:
        return Decimal.min(new Decimal(1.5).pow(np.pow(0.6)), 1e30)
      default:
        return null
    }
  }
})();

