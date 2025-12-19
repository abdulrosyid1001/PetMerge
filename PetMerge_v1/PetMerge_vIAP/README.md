# PetMerge - IAP Version

A merge-style puzzle game built with Construct 3, featuring multiple ad platform integrations and in-app purchases.

## Project Overview

PetMerge is a casual merge game where players combine cute animals to progress through levels. This version includes:
- **Adventure Mode**: Level-based progression with goals and challenges
- **Classic Mode**: Endless gameplay for high scores
- **Boosters System**: Power-ups to help players complete levels
- **In-App Purchases**: Coins, boosters, and special offers
- **Multi-Platform Support**: Integrated with 15+ ad platforms

## Project Structure

```
PetMerge_vIAP/
├── scripts/              # JavaScript modules
│   ├── AdsConfig.js      # Ad platform integration & analytics
│   ├── EventImports.js   # Game utilities & banner management
│   ├── IAP.js            # In-app purchase configurations
│   ├── languages.js      # Translations (EN, ID, RU)
│   └── levelMissionData.js # Level data & missions
├── eventSheets/          # Construct 3 event logic
├── layouts/              # Game scenes/screens
├── objectTypes/          # Game objects & sprites
├── images/               # Image assets
├── sounds/               # Sound effects
├── music/                # Background music
└── fonts/                # Font files
```

## Key Features

### Ad Platform Support
The game integrates with multiple ad platforms:
- **Azerion** (Game Distribution)
- **Poki**
- **CrazyGames**
- **Xiaomi (MiGames)**
- **Facebook Instant Games**
- **Yandex Games**
- **Glance**
- **Lagged**
- **LudiGames**
- **PlayDeck**
- **Transsion**
- **Gopay**
- **Huawei**

### Analytics Integration
- **GameAnalytics** integration for tracking:
  - Progression events (level start/complete/fail)
  - Design events (custom metrics)
  - Resource events (currency flow)
  - Ad events (impressions, clicks)
  - User segmentation (new/returning/old users)

### Game Modes
1. **Adventure Mode**:
   - 80+ levels with unique missions
   - Star collection system
   - Unlock progression

2. **Classic Mode**:
   - Endless gameplay
   - High score tracking
   - Survival-based mechanics

### Boosters
- **Hammer**: Remove any tile
- **Shake**: Shuffle all tiles
- **Brush**: Remove small animals
- **Rainbow**: Grow any animal

### In-App Purchases
- Coin bundles
- Booster packs
- Limited-time offers
- Daily/weekly bonuses

## Development

### Technology Stack
- **Game Engine**: Construct 3
- **Language**: JavaScript (ES6+)
- **Build Version**: v3.0.0

### Configuration

#### Platform Selection
Edit `scripts/AdsConfig.js` to change the platform:
```javascript
export let platform_ad = "Stagging"; // Change to your target platform
```

Available platforms: `"Azerion"`, `"Poki"`, `"CrazyGames"`, `"Xiaomi"`, `"Facebook"`, `"Yandex"`, etc.

#### Language Support
Translations are stored in `scripts/languages.js`:
- English (`en`)
- Indonesian (`id`)
- Russian (`ru`)

Add new languages by extending the `translations` object.

#### Analytics Keys
Analytics configuration is in `scripts/AdsConfig.js`:
```javascript
const ANALYTICS_KEYS = {
    Glance: { game_key: "...", secret_key: "..." },
    Xiaomi: { game_key: "...", secret_key: "..." },
    // ... other platforms
};
```

### Build & Deploy

1. Open the project in Construct 3
2. Configure platform settings in `AdsConfig.js`
3. Test locally or export for web
4. Deploy to target platform

### URL Parameters
- `?lang=en` - Set language (en, id, ru)
- `?gm=on` - Enable god mode (debug mode)

## Code Quality Standards

This project follows clean code principles:
- ✅ Modern ES6+ JavaScript syntax
- ✅ Consistent code formatting
- ✅ No debug console.log statements in production
- ✅ JSDoc documentation for functions
- ✅ Named constants for magic numbers
- ✅ Proper error handling
- ✅ `const`/`let` instead of `var`

## Game Mechanics

### Merging System
- Drag and drop tiles to merge identical animals
- Merged animals evolve into larger species
- Chain merges for bonus points

### Level Objectives
Different level types with various goals:
- Reach specific animal levels
- Collect target animals
- Break obstacle boxes (wood, ice, dessert, mystery)
- Complete within move limits

### Booster Usage
Players can purchase or earn boosters:
- Unlocked at specific levels
- Limited quantities
- Can be refilled via IAP or rewards

### Star Jar System
- Collect stars from completed levels
- Fill the star jar to unlock rewards
- Special currency for exclusive items

## Contact & Support

For support or inquiries about this project, please contact the development team.

## Version History

### v3.0.0 (Current - IAP Version)
- Added in-app purchase system
- Multi-platform ad integration
- Enhanced analytics tracking
- Code cleanup and modernization
- JSDoc documentation
- Performance optimizations

---

**Game Type**: Casual Puzzle
**Genre**: Merge Game
**Platform**: Web (HTML5)
**Engine**: Construct 3
**Status**: Production Ready
