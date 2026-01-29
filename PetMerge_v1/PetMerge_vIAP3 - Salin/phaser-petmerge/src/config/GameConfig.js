/**
 * Pet Merge Game Configuration
 * Converted from Construct 3 Project: Pet Merge
 *
 * This is a Suika Game style merge game with pets/animals
 * Original viewport: 430x932 (portrait mobile)
 */

const GAME_CONFIG = {
    // Viewport settings from C3 project
    width: 430,
    height: 932,

    // Game container boundaries (from C3 layout)
    // fruitBox: x=216, y=315, width=431, height=413
    // BoundaryLine Y: 240
    container: {
        x: 1,           // Left edge
        y: 253,         // Top of play area (below boundary line)
        width: 428,     // Container width
        height: 400,    // Container height
        wallThickness: 20,  // Thick walls to prevent escape
        bottomY: 653    // Bottom of container
    },

    // Boundary/danger line position
    boundaryLineY: 240,

    // Pet/Fruit sizes from C3 project (based on Fruit.json animations)
    // Each pet level has increasing size - SCALED DOWN for mobile
    petSizes: [
        { level: 1, radius: 18, name: 'Betta Fish', score: 1 },       // Animation "1": 30x30
        { level: 2, radius: 20, name: 'Hamster', score: 3 },          // Animation "2": 32x32
        { level: 3, radius: 28, name: 'Canary', score: 6 },           // Animation "3": 52x52
        { level: 4, radius: 32, name: 'Hedgehog', score: 10 },        // Animation "4": 60x60
        { level: 5, radius: 38, name: 'Sugar Glider', score: 15 },    // Animation "5": 72x72
        { level: 6, radius: 50, name: 'Owl', score: 21 },             // Animation "6": 96x96
        { level: 7, radius: 56, name: 'Ferret', score: 28 },          // Animation "7": 108x108
        { level: 8, radius: 68, name: 'Rabbit', score: 36 },          // Animation "8": 132x132
        { level: 9, radius: 74, name: 'Racoon', score: 45 },          // Animation "9": 144x144
        { level: 10, radius: 92, name: 'Cat', score: 55 },            // Animation "10": 180x180
        { level: 11, radius: 106, name: 'Dog', score: 66 },           // Animation "11": 208x208
        { level: 12, radius: 68, name: 'Alpaca', score: 78 },         // Animation "12" (bonus)
        { level: 13, radius: 74, name: 'Albino Lion', score: 100 }    // Animation "13" (final)
    ],

    // Pet colors for placeholder graphics
    petColors: [
        0x6BB5FF,  // 1 - Betta Fish (blue)
        0xFFB366,  // 2 - Hamster (orange)
        0xFFFF66,  // 3 - Canary (yellow)
        0xBBAA88,  // 4 - Hedgehog (brown)
        0xAAAAAA,  // 5 - Sugar Glider (gray)
        0x8B5A2B,  // 6 - Owl (brown)
        0xE8D4B8,  // 7 - Ferret (cream)
        0xFFF5EE,  // 8 - Rabbit (white/cream)
        0x555555,  // 9 - Racoon (dark gray)
        0xFF8C00,  // 10 - Cat (orange)
        0xC4A484,  // 11 - Dog (tan)
        0xF5F5DC,  // 12 - Alpaca (beige)
        0xFFD700   // 13 - Albino Lion (gold)
    ],

    // Spawnable pet levels (only smaller pets can be dropped - levels 1-5)
    maxSpawnLevel: 5,

    // Physics settings from C3 project
    // GameManager Physics: gravity=28, friction=0.5, elasticity=0.2
    // Limits Physics: friction=0.2, elasticity=0 (walls)
    physics: {
        gravity: 2.8,           // Scaled from C3's 28
        petFriction: 0.3,       // Friction between pets
        petFrictionStatic: 0.5,
        petRestitution: 0.1,    // Low bounce for pets
        petDensity: 0.001,      // Density for pets
        wallFriction: 0.2,      // Wall friction from C3
        wallRestitution: 0,     // No bounce on walls (elasticity=0)
        frictionAir: 0.01,
        slop: 0.05              // Collision slop
    },

    // Timing
    dropCooldown: 400,      // ms between drops
    gameOverDelay: 2000,    // ms a pet must be above line to trigger game over
    mergeDelay: 50,         // ms delay before pet can merge after drop

    // Boosters
    boosters: {
        hammer: { cost: 100, description: 'Remove one pet' },
        brush: { cost: 150, description: 'Remove lowest level pets' },
        tornado: { cost: 200, description: 'Shuffle all pets' },
        rainbow: { cost: 250, description: 'Merge any two pets' },
        levelUp: { cost: 300, description: 'Level up lowest pet' }
    },

    // Game modes
    modes: {
        classic: {
            name: 'Classic',
            hasTimeLimit: false,
            hasMoveLimit: false
        },
        adventure: {
            name: 'Adventure',
            hasMoveLimit: true
        }
    },

    // Spawn probabilities for adventure mode
    defaultProbabilities: [0.35, 0.30, 0.20, 0.10, 0.05, 0.00],

    // Collision categories for proper physics separation
    categories: {
        pet: 0x0001,
        wall: 0x0002,
        sensor: 0x0004
    }
};
