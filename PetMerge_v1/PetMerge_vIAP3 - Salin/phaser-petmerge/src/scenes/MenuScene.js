/**
 * MenuScene - Main menu with mode selection
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        debugLog('MenuScene: create started');

        // Background
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Title
        this.add.text(GAME_CONFIG.width / 2, 100, 'PET MERGE', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#333333',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(GAME_CONFIG.width / 2, 160, 'A Suika Game', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#555555'
        }).setOrigin(0.5);

        // Pet showcase
        this.createPetShowcase();

        // Classic Mode Button
        this.createModeButton(
            GAME_CONFIG.width / 2,
            500,
            'CLASSIC MODE',
            'Endless gameplay - Get the highest score!',
            0x4CAF50,
            () => this.startClassicMode()
        );

        // Adventure Mode Button
        this.createModeButton(
            GAME_CONFIG.width / 2,
            620,
            'ADVENTURE MODE',
            'Complete levels with limited moves!',
            0x2196F3,
            () => this.startAdventureMode()
        );

        // Load progress
        this.adventureProgress = parseInt(localStorage.getItem('petmerge_adventure_level') || '1');

        // Show progress badge
        this.add.text(GAME_CONFIG.width / 2 + 80, 620, `Lv ${this.adventureProgress}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            backgroundColor: '#FF9800',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);

        // High score display
        const highScore = localStorage.getItem('petmerge_highscore') || '0';
        this.add.text(GAME_CONFIG.width / 2, 750, `Best Score: ${highScore}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#666666'
        }).setOrigin(0.5);
    }

    createPetShowcase() {
        // Display a few pets in the center
        const petsToShow = [1, 3, 5, 7, 9, 11];
        const startX = 65;
        const y = 320;
        const spacing = 70;

        petsToShow.forEach((level, index) => {
            const pet = this.add.image(startX + index * spacing, y, `pet_${level}`);
            pet.setScale(0.8);

            // Floating animation
            this.tweens.add({
                targets: pet,
                y: y - 10,
                duration: 1000 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createModeButton(x, y, title, description, color, callback) {
        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(x - 170, y - 40, 340, 80, 15);

        // Button border
        bg.lineStyle(4, Phaser.Display.Color.ValueToColor(color).darken(20).color);
        bg.strokeRoundedRect(x - 170, y - 40, 340, 80, 15);

        // Make interactive
        const hitArea = this.add.rectangle(x, y, 340, 80, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        // Title text
        const titleText = this.add.text(x, y - 12, title, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Description text
        const descText = this.add.text(x, y + 15, description, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            alpha: 0.9
        }).setOrigin(0.5);

        // Hover effects
        hitArea.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(Phaser.Display.Color.ValueToColor(color).lighten(10).color, 1);
            bg.fillRoundedRect(x - 175, y - 45, 350, 90, 15);
            bg.lineStyle(4, Phaser.Display.Color.ValueToColor(color).darken(20).color);
            bg.strokeRoundedRect(x - 175, y - 45, 350, 90, 15);
        });

        hitArea.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(x - 170, y - 40, 340, 80, 15);
            bg.lineStyle(4, Phaser.Display.Color.ValueToColor(color).darken(20).color);
            bg.strokeRoundedRect(x - 170, y - 40, 340, 80, 15);
        });

        hitArea.on('pointerdown', callback);
    }

    startClassicMode() {
        debugLog('MenuScene: Starting classic mode...');
        // Pass mode to game scene
        this.scene.start('GameScene', { mode: 'classic' });
        this.scene.start('UIScene');
        this.scene.start('BoosterScene');
    }

    startAdventureMode() {
        debugLog('MenuScene: Going to level select...');
        // Go to level select
        this.scene.start('LevelSelectScene');
    }
}
