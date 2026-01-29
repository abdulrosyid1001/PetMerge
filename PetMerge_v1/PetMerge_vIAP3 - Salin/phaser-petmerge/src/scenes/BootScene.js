/**
 * BootScene - Handles asset loading from C3 project assets
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        debugLog('BootScene: preload started');

        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4CAF50, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            debugLog('BootScene: All assets loaded');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Handle load errors gracefully
        this.load.on('loaderror', (file) => {
            debugWarn('BootScene: Failed to load asset:', file.key, file.url);
            // Continue loading - don't crash
        });

        // Load pet images from C3 project
        this.loadPetAssets();

        // Load UI assets
        this.loadUIAssets();

        // Load booster assets
        this.loadBoosterAssets();

        // Load background
        this.loadBackgroundAssets();
    }

    loadPetAssets() {
        debugLog('BootScene: Loading pet assets...');
        // Load all 13 pet/fruit images from C3 project
        for (let i = 1; i <= 13; i++) {
            this.load.image(`pet_${i}`, `assets/pets/fruit-${i}-000.png`);
        }
        debugLog('BootScene: Pet assets queued');
    }

    loadUIAssets() {
        // Load UI elements from C3 project
        this.load.image('fruitbox', 'assets/ui/fruitbox.png');
        this.load.image('scoreframe', 'assets/ui/scoreframe.png');
        this.load.image('nextframe', 'assets/ui/nextframe.png');
        this.load.image('trophy', 'assets/ui/trophy.png');
        this.load.image('settings', 'assets/ui/settings.png');
        this.load.image('danger_line', 'assets/ui/dangerline.png');
    }

    loadBoosterAssets() {
        // Load booster button images
        for (let i = 0; i <= 3; i++) {
            this.load.image(`booster_btn_${i}`, `assets/boosters/boostersbutton-default-00${i}.png`);
        }
        // Load booster frame images
        this.load.image('booster_frame_0', 'assets/boosters/boostersframe-animation 1-000.png');
        this.load.image('booster_frame_1', 'assets/boosters/boostersframe-animation 1-001.png');
    }

    loadBackgroundAssets() {
        // Load background from C3 project
        this.load.image('background', 'assets/backgrounds/background-normal-000.png');
    }

    create() {
        debugLog('BootScene: create started');

        // Create generated textures for things not loaded from files
        this.createGeneratedTextures();

        debugLog('BootScene: Starting MenuScene...');
        // Start from the menu
        this.scene.start('MenuScene');
    }

    createGeneratedTextures() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Next pet preview box (fallback)
        graphics.fillStyle(0xFFFFFF, 0.9);
        graphics.fillRoundedRect(0, 0, 80, 80, 10);
        graphics.lineStyle(3, 0x333333);
        graphics.strokeRoundedRect(1, 1, 78, 78, 9);
        graphics.generateTexture('preview_box', 80, 80);
        graphics.clear();

        // Score panel (fallback)
        graphics.fillStyle(0x2E7D32, 0.9);
        graphics.fillRoundedRect(0, 0, 200, 60, 15);
        graphics.generateTexture('score_panel', 200, 60);
        graphics.clear();

        // Game over panel
        graphics.fillStyle(0x000000, 0.8);
        graphics.fillRoundedRect(0, 0, 350, 250, 20);
        graphics.generateTexture('gameover_panel', 350, 250);
        graphics.clear();

        // Restart button
        graphics.fillStyle(0x4CAF50, 1);
        graphics.fillRoundedRect(0, 0, 180, 60, 15);
        graphics.generateTexture('restart_btn', 180, 60);
        graphics.clear();

        // Merge particle
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('merge_particle', 16, 16);
        graphics.clear();

        // Container background (drawn separately)
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(0, 0, 400, 700, 20);
        graphics.lineStyle(8, 0x654321);
        graphics.strokeRoundedRect(4, 4, 392, 692, 18);
        graphics.generateTexture('container_bg', 400, 700);

        graphics.destroy();

        // Create booster fallback textures
        this.createBoosterFallbackTextures();
    }

    createBoosterFallbackTextures() {
        const boosterData = [
            { name: 'hammer', color: 0xFF6B6B },
            { name: 'brush', color: 0x4ECDC4 },
            { name: 'tornado', color: 0x95E1D3 },
            { name: 'rainbow', color: 0xFFE66D },
            { name: 'levelUp', color: 0xA8E6CF }
        ];

        boosterData.forEach(booster => {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            const size = 60;

            // Button background with rounded corners
            graphics.fillStyle(booster.color, 1);
            graphics.fillRoundedRect(0, 0, size, size, 12);

            // Darker border
            graphics.lineStyle(3, Phaser.Display.Color.ValueToColor(booster.color).darken(30).color);
            graphics.strokeRoundedRect(1, 1, size - 2, size - 2, 11);

            // Inner highlight
            graphics.fillStyle(0xFFFFFF, 0.3);
            graphics.fillRoundedRect(5, 5, size - 10, 15, 5);

            graphics.generateTexture(`booster_${booster.name}`, size, size);
            graphics.destroy();
        });
    }
}
