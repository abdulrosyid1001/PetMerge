/**
 * BoosterScene - Handles booster UI and functionality
 * Boosters: Hammer, Brush, Tornado, Rainbow, LevelUp
 */
class BoosterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoosterScene' });
    }

    create() {
        // Get reference to game scene
        this.gameScene = this.scene.get('GameScene');

        // Booster counts (stored in localStorage)
        this.boosterCounts = this.loadBoosterCounts();

        // Currently active booster
        this.activeBooster = null;

        // Create booster buttons
        this.createBoosterUI();

        // Listen for booster usage completion
        this.gameScene.events.on('boosterUsed', this.onBoosterUsed, this);
        this.gameScene.events.on('boosterCancelled', this.onBoosterCancelled, this);

        // Clean up on shutdown
        this.events.on('shutdown', () => {
            this.gameScene.events.off('boosterUsed', this.onBoosterUsed, this);
            this.gameScene.events.off('boosterCancelled', this.onBoosterCancelled, this);
        });
    }

    loadBoosterCounts() {
        const stored = localStorage.getItem('petmerge_boosters');
        if (stored) {
            return JSON.parse(stored);
        }
        // Default starter boosters
        return {
            hammer: 3,
            brush: 3,
            tornado: 3,
            rainbow: 1,
            levelUp: 1
        };
    }

    saveBoosterCounts() {
        localStorage.setItem('petmerge_boosters', JSON.stringify(this.boosterCounts));
    }

    createBoosterUI() {
        const boosters = ['hammer', 'brush', 'tornado'];
        const startX = 60;
        const y = GAME_CONFIG.height - 60;
        const spacing = 80;

        this.boosterButtons = {};

        boosters.forEach((boosterName, index) => {
            const x = startX + index * spacing;

            // Create button container
            const container = this.add.container(x, y);

            // Button background
            const bg = this.add.image(0, 0, `booster_${boosterName}`);
            bg.setInteractive({ useHandCursor: true });

            // Count badge
            const countBg = this.add.circle(20, -20, 14, 0xFF4444);
            const countText = this.add.text(20, -20, this.boosterCounts[boosterName].toString(), {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, countBg, countText]);

            // Store reference
            this.boosterButtons[boosterName] = {
                container,
                bg,
                countBg,
                countText
            };

            // Button interactions
            bg.on('pointerover', () => {
                if (this.activeBooster !== boosterName) {
                    bg.setScale(1.1);
                }
            });

            bg.on('pointerout', () => {
                if (this.activeBooster !== boosterName) {
                    bg.setScale(1);
                }
            });

            bg.on('pointerdown', () => {
                this.activateBooster(boosterName);
            });
        });

        // Create instruction text (hidden by default)
        this.instructionText = this.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 120, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            backgroundColor: '#333333',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        this.instructionText.setVisible(false);

        // Cancel button (hidden by default)
        this.cancelBtn = this.add.text(GAME_CONFIG.width - 60, GAME_CONFIG.height - 120, 'CANCEL', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            backgroundColor: '#FF4444',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        this.cancelBtn.setInteractive({ useHandCursor: true });
        this.cancelBtn.on('pointerdown', () => this.cancelBooster());
        this.cancelBtn.setVisible(false);
    }

    activateBooster(boosterName) {
        // Check if already active
        if (this.activeBooster === boosterName) {
            this.cancelBooster();
            return;
        }

        // Check if has enough boosters
        if (this.boosterCounts[boosterName] <= 0) {
            this.showNotEnoughBoostersMessage(boosterName);
            return;
        }

        // Check if game is in valid state
        if (this.gameScene.isGameOver) {
            return;
        }

        // Deactivate previous booster if any
        if (this.activeBooster) {
            this.resetBoosterButton(this.activeBooster);
        }

        this.activeBooster = boosterName;

        // Highlight active button
        const btn = this.boosterButtons[boosterName];
        btn.bg.setScale(1.2);
        btn.bg.setTint(0x00FF00);

        // Show instruction
        this.showBoosterInstruction(boosterName);

        // Notify game scene
        this.gameScene.setActiveBooster(boosterName);
    }

    cancelBooster() {
        if (this.activeBooster) {
            this.resetBoosterButton(this.activeBooster);
            this.gameScene.setActiveBooster(null);
            this.activeBooster = null;
            this.hideBoosterInstruction();
        }
    }

    resetBoosterButton(boosterName) {
        const btn = this.boosterButtons[boosterName];
        if (btn) {
            btn.bg.setScale(1);
            btn.bg.clearTint();
        }
    }

    showBoosterInstruction(boosterName) {
        const instructions = {
            hammer: 'Tap a pet to remove it',
            brush: 'Tap to remove all lowest-level pets',
            tornado: 'Tap to shuffle all pets',
            rainbow: 'Tap two pets to merge them',
            levelUp: 'Tap a pet to level it up'
        };

        this.instructionText.setText(instructions[boosterName]);
        this.instructionText.setVisible(true);
        this.cancelBtn.setVisible(true);
    }

    hideBoosterInstruction() {
        this.instructionText.setVisible(false);
        this.cancelBtn.setVisible(false);
    }

    showNotEnoughBoostersMessage(boosterName) {
        const msg = this.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, `No ${boosterName} boosters left!`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FF4444',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            alpha: 0,
            y: msg.y - 50,
            duration: 1500,
            onComplete: () => msg.destroy()
        });
    }

    onBoosterUsed(boosterName) {
        // Decrease count
        this.boosterCounts[boosterName]--;
        this.saveBoosterCounts();

        // Update UI
        this.updateBoosterCount(boosterName);

        // Reset button state
        this.resetBoosterButton(boosterName);
        this.activeBooster = null;
        this.hideBoosterInstruction();
    }

    onBoosterCancelled() {
        if (this.activeBooster) {
            this.resetBoosterButton(this.activeBooster);
            this.activeBooster = null;
            this.hideBoosterInstruction();
        }
    }

    updateBoosterCount(boosterName) {
        const btn = this.boosterButtons[boosterName];
        if (btn) {
            btn.countText.setText(this.boosterCounts[boosterName].toString());

            // Gray out if no boosters left
            if (this.boosterCounts[boosterName] <= 0) {
                btn.bg.setAlpha(0.5);
            }
        }
    }

    // Add boosters (for rewards, purchases, etc.)
    addBoosters(boosterName, amount) {
        this.boosterCounts[boosterName] += amount;
        this.saveBoosterCounts();
        this.updateBoosterCount(boosterName);

        // Re-enable button if it was grayed out
        const btn = this.boosterButtons[boosterName];
        if (btn) {
            btn.bg.setAlpha(1);
        }
    }
}
