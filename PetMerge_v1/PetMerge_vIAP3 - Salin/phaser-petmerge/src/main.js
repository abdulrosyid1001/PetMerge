/**
 * Pet Merge - Main Entry Point
 * A Suika Game style merge game with pets
 * Converted from Construct 3 Project
 */

// Debug mode - set to true for verbose logging
const DEBUG_MODE = true;

// Debug logger
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log('[PetMerge]', ...args);
    }
}

function debugError(...args) {
    console.error('[PetMerge ERROR]', ...args);
}

function debugWarn(...args) {
    console.warn('[PetMerge WARN]', ...args);
}

// Make debug functions globally available
window.debugLog = debugLog;
window.debugError = debugError;
window.debugWarn = debugWarn;

// Global error handler to prevent game freeze
window.onerror = function(message, source, lineno, colno, error) {
    // Ignore "Script error" from CDN (CORS) - these are not real errors
    if (message === 'Script error.' && !source) {
        return true; // Suppress silently
    }

    debugError('Global Error:', {
        message: message,
        source: source,
        line: lineno,
        column: colno,
        error: error
    });
    // Don't freeze - return true to suppress the error
    return true;
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
    debugError('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
};

// Error boundary for async operations
window.safeAsync = async function(fn, fallback = null) {
    try {
        return await fn();
    } catch (error) {
        debugError('Async Error:', error);
        return fallback;
    }
};

// Safe function wrapper
window.safeCall = function(fn, context = null, ...args) {
    try {
        return fn.apply(context, args);
    } catch (error) {
        debugError('SafeCall Error:', error);
        return null;
    }
};

debugLog('Initializing game...');
debugLog('GAME_CONFIG:', GAME_CONFIG);

const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: GAME_CONFIG.physics.gravity },
            debug: DEBUG_MODE, // Show physics debug in debug mode
            // Enable sleeping for performance
            enableSleeping: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, MenuScene, LevelSelectScene, GameScene, UIScene, BoosterScene],
    // Phaser callbacks for error handling
    callbacks: {
        preBoot: function(game) {
            debugLog('Game pre-boot');
        },
        postBoot: function(game) {
            debugLog('Game booted successfully');
            debugLog('Renderer:', game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas');
        }
    },
    // Render settings
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    }
};

// Safe game initialization
let game;
try {
    debugLog('Creating Phaser.Game instance...');
    game = new Phaser.Game(config);
    debugLog('Game instance created successfully');
} catch (error) {
    debugError('Failed to initialize game:', error);
    // Attempt recovery
    setTimeout(() => {
        try {
            debugLog('Attempting game recovery...');
            game = new Phaser.Game(config);
            debugLog('Game recovery successful');
        } catch (e) {
            debugError('Recovery failed:', e);
            // Show error message to user
            document.body.innerHTML = '<div style="color:red;padding:20px;">Game failed to load. Please refresh the page.</div>';
        }
    }, 1000);
}

// Expose game instance for debugging
window.game = game;
debugLog('Game exposed to window.game for debugging');
