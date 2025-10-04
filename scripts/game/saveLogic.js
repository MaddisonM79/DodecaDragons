/**
 * Save/load system logic for DodecaDragons
 * Pure functions for serializing and deserializing game state
 * Separated from DOM manipulation for Vue migration prep
 */

/**
 * Serialize game state to JSON string
 * @param {object} gameState - Game state object
 * @returns {string} JSON string of game state
 */
function serializeGameState(gameState) {
  return JSON.stringify(gameState)
}

/**
 * Encode game state to base64 for export
 * @param {object} gameState - Game state object
 * @returns {string} Base64 encoded game state
 */
function encodeGameState(gameState) {
  return btoa(JSON.stringify(gameState))
}

/**
 * Decode base64 string to game state object
 * @param {string} encodedState - Base64 encoded game state
 * @returns {object|null} Decoded game state or null if invalid
 */
function decodeGameState(encodedState) {
  try {
    return JSON.parse(atob(encodedState))
  } catch (e) {
    return null
  }
}

/**
 * Parse JSON string to game state object
 * @param {string} jsonState - JSON string of game state
 * @returns {object|null} Parsed game state or null if invalid
 */
function parseGameState(jsonState) {
  try {
    return JSON.parse(jsonState)
  } catch (e) {
    return null
  }
}

/**
 * Merge loaded save data into current game state
 * Handles Decimal deserialization and array merging
 * @param {object} currentState - Current game state (with defaults)
 * @param {object} loadedState - Loaded save data
 * @returns {object} Merged game state
 */
function mergeSaveData(currentState, loadedState) {
  const mergedState = { ...currentState }
  const loadKeys = Object.keys(loadedState)

  for (let i = 0; i < loadKeys.length; i++) {
    if (loadedState[loadKeys[i]] != "undefined") {
      const thisKey = loadKeys[i]

      // Handle Decimal string deserialization
      if (typeof loadedState[thisKey] == "string" && thisKey != "dragonName") {
        mergedState[thisKey] = new Decimal(loadedState[thisKey])
      }
      // Handle arrays
      else if (Array.isArray(loadedState[thisKey]) && currentState[loadKeys[i]]) {
        for (let j = 0; j < loadedState[thisKey].length; j++) {
          if (typeof loadedState[thisKey][j] == "string") {
            mergedState[loadKeys[i]][j] = new Decimal(loadedState[thisKey][j])
          } else {
            mergedState[loadKeys[i]][j] = loadedState[thisKey][j]
          }
        }
      }
      // Handle other types
      else {
        mergedState[loadKeys[i]] = loadedState[thisKey]
      }
    }
  }

  // Update last update time to current time
  mergedState.lastUpdate = Date.now()

  return mergedState
}

/**
 * Check if save version needs migration
 * @param {object} loadedState - Loaded save data
 * @param {number} currentVersion - Current game version
 * @returns {object} Object with shouldMigrate flag and oldVersion
 */
function checkSaveVersion(loadedState, currentVersion) {
  const oldVersion = loadedState.lastMajorChangeVersion
  const shouldMigrate = oldVersion === undefined || oldVersion < currentVersion

  return {
    shouldMigrate,
    oldVersion: oldVersion || 0
  }
}

/**
 * Generate save error code
 * Diagnostic code indicating save state: validSave-timeMatches-intervalStarted
 * @param {object} params - Parameters object
 * @param {number} params.lastConfirmedSave - Timestamp from localStorage
 * @param {number} params.gameLastSave - Game state lastSave timestamp
 * @param {boolean} params.autosaveStarted - Whether autosave has started
 * @returns {string} Error code (e.g., "111" = all good, "101: 5.2" = time mismatch by 5.2s)
 */
function getSaveErrorCode({ lastConfirmedSave, gameLastSave, autosaveStarted }) {
  let _validSave = 0
  let _timeMatches = 0
  let _intervalStarted = 0

  if (lastConfirmedSave > 0) _validSave = 1
  if (lastConfirmedSave === gameLastSave) _timeMatches = 1
  if (autosaveStarted) _intervalStarted = 1

  let errorCode = "" + _validSave + _timeMatches + _intervalStarted

  // If times don't match, append the number of seconds they're off by
  if (_timeMatches === 0) {
    errorCode = errorCode + ": " + (gameLastSave - lastConfirmedSave) / 1000
  }

  return errorCode
}

/**
 * Save game state to localStorage
 * @param {object} gameState - Game state to save
 * @returns {object} Object with success flag and timestamp
 */
function saveToLocalStorage(gameState) {
  try {
    const timestamp = Date.now()
    const stateWithTimestamp = { ...gameState, lastSave: timestamp }

    localStorage.setItem("dodecaSave", serializeGameState(stateWithTimestamp))
    localStorage.setItem("dodecaLastSaved", timestamp)

    return {
      success: true,
      timestamp
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

/**
 * Load game state from localStorage
 * @returns {object|null} Loaded game state or null if not found
 */
function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem("dodecaSave")
    if (!savedData) return null
    return parseGameState(savedData)
  } catch (e) {
    return null
  }
}

/**
 * Get last saved timestamp from localStorage
 * @returns {number} Timestamp or 0 if not found
 */
function getLastSavedTimestamp() {
  try {
    const timestamp = localStorage.getItem("dodecaLastSaved")
    return timestamp ? parseInt(timestamp) : 0
  } catch (e) {
    return 0
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.saveLogic = {
    serializeGameState,
    encodeGameState,
    decodeGameState,
    parseGameState,
    mergeSaveData,
    checkSaveVersion,
    getSaveErrorCode,
    saveToLocalStorage,
    loadFromLocalStorage,
    getLastSavedTimestamp
  }
}

// Export for Node.js/module systems (future Vue)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    serializeGameState,
    encodeGameState,
    decodeGameState,
    parseGameState,
    mergeSaveData,
    checkSaveVersion,
    getSaveErrorCode,
    saveToLocalStorage,
    loadFromLocalStorage,
    getLastSavedTimestamp
  }
}
