# Pet Merge - Phaser 3 Game

A Suika Game / Watermelon Game style merge game with cute pets, converted from the Construct 3 project.

## Game Description

Drop pets into the container and merge matching ones to create bigger, cuter animals! The goal is to achieve the highest score by merging pets before they overflow the container.

## Game Modes

### Classic Mode
- **Endless gameplay** - Play until pets overflow the container
- **High score tracking** - Beat your best score!
- **No time or move limits** - Take your time to plan merges

### Adventure Mode
- **30 levels** with increasing difficulty
- **Move limits** - Complete goals within limited drops
- **Star rating** - Earn up to 3 stars per level
- **Goals** - Create specific pets to complete each level
- **Progressive unlocking** - Complete levels to unlock new ones

## Gameplay

- **Tap/Click** to drop a pet at that position
- **Merge** two identical pets to create a bigger one
- **Score** points when pets merge
- **Game Over** when pets stack above the danger line (Classic mode)
- **Level Complete** when all goals are achieved (Adventure mode)

## Boosters

Use boosters to help complete difficult levels:

| Booster | Effect |
|---------|--------|
| **Hammer** | Remove any single pet from the container |
| **Brush** | Remove ALL pets of the lowest level |
| **Tornado** | Shuffle all pets in the container |

## Pet Evolution Chain

1. Betta Fish (smallest)
2. Hamster
3. Canary
4. Hedgehog
5. Sugar Glider
6. Owl
7. Ferret
8. Rabbit
9. Racoon
10. Cat
11. Dog
12. Alpaca
13. Albino Lion (largest)

## Project Structure

```
phaser-petmerge/
├── index.html              # Main HTML file
├── README.md               # This file
├── assets/                 # Asset folders (for custom graphics)
│   ├── pets/
│   └── ui/
└── src/
    ├── main.js             # Phaser game initialization
    ├── config/
    │   ├── GameConfig.js   # Game configuration and constants
    │   └── LevelData.js    # Adventure mode level definitions
    └── scenes/
        ├── BootScene.js    # Asset loading and texture generation
        ├── MenuScene.js    # Main menu with mode selection
        ├── LevelSelectScene.js  # Adventure mode level select
        ├── GameScene.js    # Main gameplay with physics
        ├── UIScene.js      # UI overlay (score, next pet, game over)
        └── BoosterScene.js # Booster buttons and functionality
```

## How to Run

1. **Using a local server** (required for loading assets):
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Using VS Code Live Server extension
   # Right-click on index.html -> "Open with Live Server"
   ```

2. Open your browser and navigate to `http://localhost:8000`

## Technical Details

### Physics Engine
- Uses **Matter.js** (Phaser's built-in physics engine)
- Circular collision bodies for accurate pet interactions
- Configurable gravity, friction, and bounciness
- Collision categories to properly separate pet-pet and pet-wall collisions
- Safety bounds to prevent pets from escaping the container

### Construct 3 to Phaser Conversion

| C3 Feature | Phaser Implementation |
|------------|----------------------|
| Fruit sprite (Physics behavior) | Matter.js physics bodies |
| Limits (TiledBg + Physics + Solid) | Static Matter.js rectangles with no bounce |
| Touch input for drop position | Phaser input pointer events |
| Physics collision detection | Matter.js collision events |
| Score/High score (event variables) | Scene data + localStorage |
| Animations for pet levels | Texture switching on merge |
| Particle effects on merge | Phaser Particles system |
| Boosters (hammer, brush, tornado) | Booster scene with event-based actions |
| Adventure mode with goals | Level data + goal tracking system |

### Key Configuration (GameConfig.js)

```javascript
// Viewport (portrait mobile)
width: 430,
height: 932,

// Physics settings matched from C3 project
physics: {
    gravity: 2.8,           // Scaled from C3's 28
    petFriction: 0.3,
    petRestitution: 0.1,    // Low bounce
    wallFriction: 0.2,
    wallRestitution: 0      // No bounce on walls
}

// Collision categories
categories: {
    pet: 0x0001,
    wall: 0x0002,
    sensor: 0x0004
}
```

## Customizing Assets

The game uses procedurally generated placeholder graphics. To use custom pet images:

1. Add your pet images to `assets/pets/` (e.g., `pet_1.png` through `pet_13.png`)
2. Modify `BootScene.js` to load images instead of generating textures:

```javascript
preload() {
    for (let i = 1; i <= 13; i++) {
        this.load.image(`pet_${i}`, `assets/pets/pet_${i}.png`);
    }
}
```

## Features Implemented

- [x] Physics-based pet dropping and merging
- [x] 13 pet evolution levels
- [x] Score tracking with high score persistence
- [x] Game over when pets overflow
- [x] Next pet preview
- [x] Merge particle effects
- [x] Responsive design for mobile
- [x] Classic endless mode
- [x] Adventure mode with 30 levels
- [x] Level goals and move limits
- [x] Star rating system
- [x] Boosters (Hammer, Brush, Tornado)
- [x] Main menu with mode selection
- [x] Level select screen

## Future Enhancements

To match the full C3 project, you could add:
- Special obstacles (wood boxes, ice boxes, jam)
- Rainbow booster (merge any two pets)
- Level Up booster (upgrade lowest pet)
- Store and in-app purchases
- Sound effects and background music
- Tutorial system
- Daily login rewards

## Credits

- Original Construct 3 Project: Pet Merge by GAMOTIONS
- Phaser 3 Framework: https://phaser.io
- Matter.js Physics: https://brm.io/matter-js
