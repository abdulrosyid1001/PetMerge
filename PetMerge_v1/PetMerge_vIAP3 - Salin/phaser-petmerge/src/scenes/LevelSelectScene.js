/**
 * LevelSelectScene - Level selection for Adventure mode
 */
class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Load progress
        this.maxUnlockedLevel = parseInt(localStorage.getItem('petmerge_adventure_level') || '1');

        // Title
        this.add.text(GAME_CONFIG.width / 2, 50, 'ADVENTURE MODE', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Back button
        const backBtn = this.add.text(30, 50, '< BACK', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#FFFFFF'
        });
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
        backBtn.on('pointerover', () => backBtn.setColor('#FFD700'));
        backBtn.on('pointerout', () => backBtn.setColor('#FFFFFF'));

        // Create level grid
        this.createLevelGrid();
    }

    createLevelGrid() {
        const startY = 120;
        const cols = 5;
        const rows = 6;
        const cellWidth = 70;
        const cellHeight = 90;
        const startX = (GAME_CONFIG.width - cols * cellWidth) / 2 + cellWidth / 2;

        for (let i = 0; i < LEVEL_DATA.length && i < cols * rows; i++) {
            const level = i + 1;
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;

            this.createLevelButton(x, y, level);
        }

        // Scroll hint if more levels
        if (LEVEL_DATA.length > cols * rows) {
            this.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 50, 'Scroll for more levels', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#888888'
            }).setOrigin(0.5);
        }
    }

    createLevelButton(x, y, level) {
        const isUnlocked = level <= this.maxUnlockedLevel;
        const isCompleted = level < this.maxUnlockedLevel;

        // Button background
        const bg = this.add.graphics();

        if (isUnlocked) {
            bg.fillStyle(isCompleted ? 0x4CAF50 : 0x2196F3, 1);
        } else {
            bg.fillStyle(0x555555, 1);
        }

        bg.fillRoundedRect(x - 25, y - 25, 50, 60, 10);

        // Level number
        const levelText = this.add.text(x, y - 5, level.toString(), {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Stars (show for completed levels)
        if (isCompleted) {
            const stars = this.getStarsForLevel(level);
            const starsText = this.add.text(x, y + 20, '★'.repeat(stars), {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#FFD700'
            }).setOrigin(0.5);
        } else if (!isUnlocked) {
            // Lock icon
            this.add.text(x, y + 18, '🔒', {
                fontSize: '14px'
            }).setOrigin(0.5);
        }

        // Make interactive if unlocked
        if (isUnlocked) {
            const hitArea = this.add.rectangle(x, y + 5, 50, 60, 0x000000, 0);
            hitArea.setInteractive({ useHandCursor: true });

            hitArea.on('pointerover', () => {
                bg.clear();
                bg.fillStyle(isCompleted ? 0x66BB6A : 0x42A5F5, 1);
                bg.fillRoundedRect(x - 28, y - 28, 56, 66, 10);
            });

            hitArea.on('pointerout', () => {
                bg.clear();
                bg.fillStyle(isCompleted ? 0x4CAF50 : 0x2196F3, 1);
                bg.fillRoundedRect(x - 25, y - 25, 50, 60, 10);
            });

            hitArea.on('pointerdown', () => {
                this.showLevelPreview(level);
            });
        }
    }

    getStarsForLevel(level) {
        // Load stars from storage
        const starsData = JSON.parse(localStorage.getItem('petmerge_level_stars') || '{}');
        return starsData[level] || (level < this.maxUnlockedLevel ? 1 : 0);
    }

    showLevelPreview(level) {
        const levelData = LEVEL_DATA[level - 1];
        if (!levelData) return;

        // Create overlay
        const overlay = this.add.rectangle(
            GAME_CONFIG.width / 2,
            GAME_CONFIG.height / 2,
            GAME_CONFIG.width,
            GAME_CONFIG.height,
            0x000000,
            0.7
        );
        overlay.setInteractive();

        // Panel
        const panel = this.add.graphics();
        panel.fillStyle(0x2d2d44, 1);
        panel.fillRoundedRect(40, 250, GAME_CONFIG.width - 80, 400, 20);
        panel.lineStyle(3, 0x4a4a6a);
        panel.strokeRoundedRect(40, 250, GAME_CONFIG.width - 80, 400, 20);

        // Level title
        this.add.text(GAME_CONFIG.width / 2, 280, `LEVEL ${level}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Goals section
        this.add.text(GAME_CONFIG.width / 2, 330, 'GOALS:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#FFD700'
        }).setOrigin(0.5);

        // Display goals
        let goalY = 370;
        levelData.goals.forEach(goal => {
            const petName = GAME_CONFIG.petSizes[goal.petLevel - 1]?.name || `Pet ${goal.petLevel}`;

            // Pet icon
            const petIcon = this.add.image(100, goalY, `pet_${goal.petLevel}`);
            petIcon.setScale(0.5);

            // Goal text
            this.add.text(140, goalY, `Create ${goal.qty} ${petName}${goal.qty > 1 ? 's' : ''}`, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#FFFFFF'
            }).setOrigin(0, 0.5);

            goalY += 45;
        });

        // Moves limit
        this.add.text(GAME_CONFIG.width / 2, goalY + 20, `Moves: ${levelData.moves}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#88CCFF'
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.add.graphics();
        playBtn.fillStyle(0x4CAF50, 1);
        playBtn.fillRoundedRect(100, 560, GAME_CONFIG.width - 200, 50, 12);

        const playText = this.add.text(GAME_CONFIG.width / 2, 585, 'PLAY', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const playHitArea = this.add.rectangle(GAME_CONFIG.width / 2, 585, GAME_CONFIG.width - 200, 50, 0x000000, 0);
        playHitArea.setInteractive({ useHandCursor: true });
        playHitArea.on('pointerdown', () => {
            this.startLevel(level);
        });

        // Close button
        const closeBtn = this.add.text(GAME_CONFIG.width - 60, 260, 'X', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFFFFF'
        });
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            // Remove all preview elements
            overlay.destroy();
            panel.destroy();
            playBtn.destroy();
            playText.destroy();
            playHitArea.destroy();
            closeBtn.destroy();
            // Recreate scene
            this.scene.restart();
        });
    }

    startLevel(level) {
        this.scene.start('GameScene', { mode: 'adventure', level: level });
        this.scene.start('UIScene');
        this.scene.start('BoosterScene');
    }
}
