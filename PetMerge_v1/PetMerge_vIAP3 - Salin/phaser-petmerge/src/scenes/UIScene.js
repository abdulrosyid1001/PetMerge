/**
 * UIScene - Handles all UI elements (score, next pet, game over)
 * Runs parallel to GameScene
 * Supports both Classic and Adventure modes
 */
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Get reference to game scene
        this.gameScene = this.scene.get('GameScene');

        // Create UI elements
        this.createScoreDisplay();
        this.createNextPetPreview();
        this.createGameOverPanel();

        // Listen for events from game scene
        this.gameScene.events.on('scoreUpdate', this.updateScore, this);
        this.gameScene.events.on('nextPetUpdate', this.updateNextPet, this);
        this.gameScene.events.on('gameOver', this.showGameOver, this);

        // Adventure mode events
        this.gameScene.events.on('adventureModeInit', this.initAdventureUI, this);
        this.gameScene.events.on('movesUpdate', this.updateMoves, this);
        this.gameScene.events.on('goalUpdate', this.updateGoals, this);
        this.gameScene.events.on('adventureWin', this.showAdventureWin, this);
        this.gameScene.events.on('adventureLose', this.showAdventureLose, this);

        // Clean up on shutdown
        this.events.on('shutdown', () => {
            this.gameScene.events.off('scoreUpdate', this.updateScore, this);
            this.gameScene.events.off('nextPetUpdate', this.updateNextPet, this);
            this.gameScene.events.off('gameOver', this.showGameOver, this);
            this.gameScene.events.off('adventureModeInit', this.initAdventureUI, this);
            this.gameScene.events.off('movesUpdate', this.updateMoves, this);
            this.gameScene.events.off('goalUpdate', this.updateGoals, this);
            this.gameScene.events.off('adventureWin', this.showAdventureWin, this);
            this.gameScene.events.off('adventureLose', this.showAdventureLose, this);
        });
    }

    createScoreDisplay() {
        // Use scoreframe from C3 project
        try {
            // Score panel background using C3 asset
            const scoreFrame = this.add.image(110, 50, 'scoreframe');
            scoreFrame.setDisplaySize(180, 70);
        } catch (e) {
            // Fallback to generated
            this.add.image(110, 50, 'score_panel');
        }

        // Trophy icon for high score
        try {
            const trophy = this.add.image(20, 35, 'trophy');
            trophy.setDisplaySize(24, 24);
        } catch (e) {}

        // Score label
        this.add.text(40, 25, 'SCORE', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });

        // Score value
        this.scoreText = this.add.text(40, 45, '0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });

        // High score panel (will be replaced with moves in adventure mode)
        try {
            this.highScorePanel = this.add.image(320, 50, 'scoreframe');
            this.highScorePanel.setDisplaySize(180, 70);
        } catch (e) {
            this.highScorePanel = this.add.image(320, 50, 'score_panel');
        }

        // High score label
        this.highScoreLabel = this.add.text(250, 25, 'BEST', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });

        // High score value
        this.highScoreText = this.add.text(250, 45, '0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
    }

    createNextPetPreview() {
        // Use nextframe from C3 project
        try {
            const nextFrame = this.add.image(GAME_CONFIG.width / 2, 130, 'nextframe');
            nextFrame.setDisplaySize(100, 100);
        } catch (e) {
            // Fallback
            this.add.image(GAME_CONFIG.width / 2, 140, 'preview_box');
        }

        // Next pet label
        this.add.text(GAME_CONFIG.width / 2, 90, 'NEXT', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Next pet image (will be updated)
        this.nextPetImage = this.add.image(GAME_CONFIG.width / 2, 140, 'pet_1');
        this.nextPetImage.setScale(0.6);
    }

    // Adventure mode UI initialization
    initAdventureUI(data) {
        // Change high score display to moves display
        this.highScoreLabel.setText('MOVES');
        this.highScoreText.setText(data.moves.toString());

        // Create goals panel
        this.createGoalsPanel(data);
    }

    createGoalsPanel(data) {
        // Goals container at top of screen
        this.goalsContainer = this.add.container(GAME_CONFIG.width / 2, 185);

        // Level indicator
        const levelText = this.add.text(0, -15, `Level ${data.level}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.goalsContainer.add(levelText);

        // Goal items
        this.goalItems = [];
        const goals = Object.values(data.goalProgress);
        const totalWidth = goals.length * 80;
        const startX = -totalWidth / 2 + 40;

        goals.forEach((goal, index) => {
            const x = startX + index * 80;
            const y = 15;

            // Pet icon
            const petIcon = this.add.image(x, y, `pet_${goal.petLevel}`);
            petIcon.setScale(0.4);

            // Progress text
            const progressText = this.add.text(x, y + 30, `${goal.current}/${goal.target}`, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Check mark (hidden initially)
            const checkMark = this.add.text(x + 15, y - 15, '✓', {
                fontSize: '16px',
                color: '#4CAF50'
            }).setOrigin(0.5);
            checkMark.setVisible(goal.current >= goal.target);

            this.goalsContainer.add([petIcon, progressText, checkMark]);
            this.goalItems.push({ progressText, checkMark, petLevel: goal.petLevel });
        });
    }

    updateMoves(moves) {
        this.highScoreText.setText(moves.toString());

        // Flash red when low on moves
        if (moves <= 5) {
            this.highScoreText.setColor('#FF4444');
            this.tweens.add({
                targets: this.highScoreText,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 100,
                yoyo: true
            });
        }
    }

    updateGoals(goalProgress) {
        const goals = Object.values(goalProgress);

        goals.forEach((goal, index) => {
            if (this.goalItems && this.goalItems[index]) {
                const item = this.goalItems[index];
                item.progressText.setText(`${goal.current}/${goal.target}`);

                // Show check mark if completed
                if (goal.current >= goal.target) {
                    item.checkMark.setVisible(true);
                    item.progressText.setColor('#4CAF50');
                }
            }
        });
    }

    createGameOverPanel() {
        // Container for game over UI (hidden initially)
        this.gameOverContainer = this.add.container(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
        this.gameOverContainer.setVisible(false);

        // Dark overlay
        const overlay = this.add.rectangle(0, 0, GAME_CONFIG.width, GAME_CONFIG.height, 0x000000, 0.7);
        overlay.setOrigin(0.5);

        // Panel background
        const panel = this.add.image(0, 0, 'gameover_panel');

        // Game Over text
        this.gameOverTitle = this.add.text(0, -80, 'GAME OVER', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#FF4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Final score label
        const scoreLabel = this.add.text(0, -30, 'Final Score:', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Final score value
        this.finalScoreText = this.add.text(0, 10, '0', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // New high score indicator (hidden by default)
        this.newHighScoreText = this.add.text(0, 50, 'NEW HIGH SCORE!', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.newHighScoreText.setVisible(false);

        // Stars display (for adventure mode)
        this.starsText = this.add.text(0, 50, '', {
            fontSize: '36px'
        }).setOrigin(0.5);
        this.starsText.setVisible(false);

        // Restart button
        const restartBtn = this.add.image(0, 100, 'restart_btn');
        restartBtn.setInteractive({ useHandCursor: true });

        this.restartBtnText = this.add.text(0, 100, 'PLAY AGAIN', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Button hover effects
        restartBtn.on('pointerover', () => {
            restartBtn.setScale(1.05);
            this.restartBtnText.setScale(1.05);
        });

        restartBtn.on('pointerout', () => {
            restartBtn.setScale(1);
            this.restartBtnText.setScale(1);
        });

        restartBtn.on('pointerdown', () => {
            this.hideGameOver();
            if (this.gameScene.gameMode === 'adventure') {
                this.scene.start('LevelSelectScene');
                this.scene.stop('GameScene');
                this.scene.stop('BoosterScene');
                this.scene.stop();
            } else {
                this.gameScene.restartGame();
            }
        });

        // Add all to container
        this.gameOverContainer.add([
            overlay,
            panel,
            this.gameOverTitle,
            scoreLabel,
            this.finalScoreText,
            this.newHighScoreText,
            this.starsText,
            restartBtn,
            this.restartBtnText
        ]);
    }

    updateScore(score, highScore) {
        this.scoreText.setText(score.toString());

        // Only update high score in classic mode
        if (this.gameScene.gameMode !== 'adventure') {
            this.highScoreText.setText(highScore.toString());
        }

        // Pulse animation on score change
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    updateNextPet(level) {
        this.nextPetImage.setTexture(`pet_${level}`);

        // Pop animation
        this.tweens.add({
            targets: this.nextPetImage,
            scaleX: 0.7,
            scaleY: 0.7,
            duration: 100,
            yoyo: true,
            ease: 'Bounce.out',
            onComplete: () => {
                this.nextPetImage.setScale(0.6);
            }
        });
    }

    showGameOver(score, highScore) {
        this.gameOverTitle.setText('GAME OVER');
        this.gameOverTitle.setColor('#FF4444');
        this.finalScoreText.setText(score.toString());
        this.restartBtnText.setText('PLAY AGAIN');

        // Check if new high score
        const storedHighScore = parseInt(localStorage.getItem('petmerge_highscore') || '0');
        this.newHighScoreText.setVisible(score >= storedHighScore && score > 0);
        this.starsText.setVisible(false);

        this.showPanel();
    }

    showAdventureWin(data) {
        this.gameOverTitle.setText('LEVEL COMPLETE!');
        this.gameOverTitle.setColor('#4CAF50');
        this.finalScoreText.setText(data.score.toString());
        this.restartBtnText.setText('CONTINUE');

        // Show stars
        this.starsText.setText('★'.repeat(data.stars) + '☆'.repeat(3 - data.stars));
        this.starsText.setVisible(true);
        this.newHighScoreText.setVisible(false);

        this.showPanel();
    }

    showAdventureLose(data) {
        this.gameOverTitle.setText('OUT OF MOVES!');
        this.gameOverTitle.setColor('#FF4444');
        this.finalScoreText.setText('');
        this.restartBtnText.setText('TRY AGAIN');
        this.newHighScoreText.setVisible(false);
        this.starsText.setVisible(false);

        this.showPanel();
    }

    showPanel() {
        this.gameOverContainer.setVisible(true);
        this.gameOverContainer.setScale(0.5);
        this.gameOverContainer.setAlpha(0);

        this.tweens.add({
            targets: this.gameOverContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }

    hideGameOver() {
        this.gameOverContainer.setVisible(false);
    }
}
