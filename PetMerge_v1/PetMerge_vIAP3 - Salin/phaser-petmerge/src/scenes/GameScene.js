/**
 * GameScene - Main gameplay with physics-based merge mechanics
 * Implements Suika Game style gameplay with Matter.js physics
 * Fixed collision handling to prevent pets from escaping container
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        debugLog('GameScene: constructor called');

        // Game state
        this.score = 0;
        this.highScore = 0;
        this.isGameOver = false;
        this.canDrop = true;

        // Current and next pet
        this.currentPetLevel = 1;
        this.nextPetLevel = 1;

        // Pets in play
        this.pets = [];

        // Drop position
        this.dropX = GAME_CONFIG.width / 2;

        // Collision tracking for merges
        this.mergeQueue = [];

        // Active booster
        this.activeBooster = null;

        // Adventure mode state
        this.gameMode = 'classic';
        this.adventureLevel = 1;
        this.movesLeft = 0;
        this.goals = [];
        this.goalProgress = {};
        this.levelProbabilities = null;
    }

    init(data) {
        // Receive mode data from menu/level select
        this.gameMode = data?.mode || 'classic';
        this.adventureLevel = data?.level || 1;
    }

    create() {
        debugLog('GameScene: create started');
        debugLog('GameScene: mode =', this.gameMode, ', level =', this.adventureLevel);

        // Reset game state
        this.score = 0;
        this.isGameOver = false;
        this.canDrop = true;
        this.pets = [];
        this.mergeQueue = [];
        this.activeBooster = null;

        // Load high score from localStorage
        this.highScore = parseInt(localStorage.getItem('petmerge_highscore') || '0');
        debugLog('GameScene: highScore =', this.highScore);

        // Setup adventure mode if applicable
        if (this.gameMode === 'adventure') {
            debugLog('GameScene: Setting up adventure mode...');
            this.setupAdventureMode();
        }

        // Add background from C3 project
        debugLog('GameScene: Creating background...');
        this.createBackground();

        // Configure Matter.js world
        this.matter.world.setBounds();

        // Set global gravity
        this.matter.world.setGravity(0, GAME_CONFIG.physics.gravity);

        // Setup container/walls with proper collision
        this.createContainer();

        // Setup drop indicator
        this.createDropIndicator();

        // Generate initial pets
        this.currentPetLevel = this.getRandomSpawnLevel();
        this.nextPetLevel = this.getRandomSpawnLevel();

        // Setup collision detection for merging
        this.setupCollisionDetection();

        // Setup input
        this.setupInput();

        // Create danger line using C3 asset
        this.dangerLine = this.add.image(GAME_CONFIG.width / 2, GAME_CONFIG.boundaryLineY, 'danger_line');
        this.dangerLine.setAlpha(0.7);
        this.dangerLine.setDisplaySize(GAME_CONFIG.width, 6);

        // Create particle emitter for merge effects
        this.createMergeParticles();

        // Emit initial state to UI
        this.events.emit('scoreUpdate', this.score, this.highScore);
        this.events.emit('nextPetUpdate', this.nextPetLevel);

        // Emit adventure mode data
        if (this.gameMode === 'adventure') {
            this.events.emit('adventureModeInit', {
                level: this.adventureLevel,
                moves: this.movesLeft,
                goals: this.goals,
                goalProgress: this.goalProgress
            });
        }

        // Game over check timer
        this.gameOverCheckTimer = null;

        debugLog('GameScene: create completed successfully');
    }

    createBackground() {
        // Add background image from C3
        try {
            const bg = this.add.image(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, 'background');
            bg.setDisplaySize(GAME_CONFIG.width, GAME_CONFIG.height);
            bg.setDepth(-10);
            debugLog('GameScene: Background loaded successfully');
        } catch (e) {
            debugWarn('GameScene: Background failed to load, using fallback', e);
            // Fallback to solid color
            this.cameras.main.setBackgroundColor('#87CEEB');
        }
    }

    setupAdventureMode() {
        const levelData = LEVEL_DATA[this.adventureLevel - 1];
        if (!levelData) {
            console.error('Invalid level:', this.adventureLevel);
            this.gameMode = 'classic';
            return;
        }

        this.movesLeft = levelData.moves;
        this.goals = levelData.goals;
        this.levelProbabilities = levelData.probabilities;

        // Initialize goal progress
        this.goalProgress = {};
        this.goals.forEach((goal, index) => {
            this.goalProgress[index] = { target: goal.qty, current: 0, petLevel: goal.petLevel };
        });
    }

    createContainer() {
        const c = GAME_CONFIG.container;
        const thickness = c.wallThickness;
        const cat = GAME_CONFIG.categories;

        // Wall physics options - NO BOUNCE, proper friction
        const wallOptions = {
            isStatic: true,
            friction: GAME_CONFIG.physics.wallFriction,
            frictionStatic: 1,
            restitution: GAME_CONFIG.physics.wallRestitution, // 0 = no bounce
            label: 'wall',
            collisionFilter: {
                category: cat.wall,
                mask: cat.pet // Only collide with pets
            }
        };

        // Calculate wall positions
        const leftWallX = c.x - thickness / 2;
        const rightWallX = c.x + c.width + thickness / 2;
        const bottomWallY = c.y + c.height + thickness / 2;
        const wallHeight = c.height + thickness;
        const wallCenterY = c.y + c.height / 2;

        // Left wall - extra thick to prevent escape
        this.matter.add.rectangle(
            leftWallX,
            wallCenterY,
            thickness,
            wallHeight,
            wallOptions
        );

        // Right wall - extra thick to prevent escape
        this.matter.add.rectangle(
            rightWallX,
            wallCenterY,
            thickness,
            wallHeight,
            wallOptions
        );

        // Bottom wall - spans full width including corners
        this.matter.add.rectangle(
            c.x + c.width / 2,
            bottomWallY,
            c.width + thickness * 2,
            thickness,
            wallOptions
        );

        // Add invisible corner blockers to prevent pets slipping through corners
        const cornerOptions = {
            isStatic: true,
            friction: 1,
            restitution: 0,
            label: 'wall',
            collisionFilter: {
                category: cat.wall,
                mask: cat.pet
            }
        };

        // Bottom-left corner blocker
        this.matter.add.rectangle(
            c.x - thickness / 4,
            c.y + c.height + thickness / 4,
            thickness / 2,
            thickness / 2,
            cornerOptions
        );

        // Bottom-right corner blocker
        this.matter.add.rectangle(
            c.x + c.width + thickness / 4,
            c.y + c.height + thickness / 4,
            thickness / 2,
            thickness / 2,
            cornerOptions
        );

        // Visual container - use fruitbox image from C3
        try {
            // Add fruitbox as 9-slice or scaled image
            const fruitbox = this.add.image(c.x + c.width / 2, c.y + c.height / 2, 'fruitbox');
            fruitbox.setDisplaySize(c.width + thickness * 2, c.height + thickness);
            fruitbox.setDepth(-5);
        } catch (e) {
            // Fallback to drawn graphics
            const graphics = this.add.graphics();

            // Draw container walls (visual only)
            graphics.fillStyle(0x8B4513, 1);

            // Left wall visual
            graphics.fillRect(c.x - thickness, c.y, thickness, c.height + thickness);
            // Right wall visual
            graphics.fillRect(c.x + c.width, c.y, thickness, c.height + thickness);
            // Bottom wall visual
            graphics.fillRect(c.x - thickness, c.y + c.height, c.width + thickness * 2, thickness);

            // Inner shadow for depth
            graphics.fillStyle(0x654321, 1);
            graphics.fillRect(c.x, c.y + c.height - 5, c.width, 5);

            // Container background (gameplay area)
            graphics.fillStyle(0xFFF8DC, 0.3);
            graphics.fillRect(c.x, c.y, c.width, c.height);

            this.containerGraphics = graphics;
        }
    }

    createDropIndicator() {
        const c = GAME_CONFIG.container;

        // Vertical guide line
        this.dropLine = this.add.graphics();
        this.dropLine.lineStyle(2, 0x666666, 0.5);
        this.dropLine.lineBetween(0, 0, 0, c.y - 50);

        // Preview pet at top
        this.previewPet = this.add.image(GAME_CONFIG.width / 2, 200, `pet_${this.currentPetLevel}`);
        this.previewPet.setScale(0.8);
    }

    updateDropIndicator(x) {
        const c = GAME_CONFIG.container;

        // Clamp X within container bounds with pet radius padding
        const petRadius = GAME_CONFIG.petSizes[this.currentPetLevel - 1].radius;
        const minX = c.x + petRadius + 5;
        const maxX = c.x + c.width - petRadius - 5;
        this.dropX = Phaser.Math.Clamp(x, minX, maxX);

        // Update drop line
        this.dropLine.clear();
        this.dropLine.lineStyle(2, 0x666666, 0.3);
        this.dropLine.lineBetween(this.dropX, 150, this.dropX, c.y);

        // Update preview pet position
        this.previewPet.setPosition(this.dropX, 200);
    }

    setupInput() {
        // Mouse/touch input for positioning
        this.input.on('pointermove', (pointer) => {
            if (!this.isGameOver && !this.activeBooster) {
                this.updateDropIndicator(pointer.x);
            }
        });

        // Click/tap to drop or use booster
        this.input.on('pointerdown', (pointer) => {
            if (this.isGameOver) return;

            // Check if booster is active
            if (this.activeBooster) {
                this.handleBoosterClick(pointer);
                return;
            }

            // Normal drop - user can tap anywhere, X position will be clamped
            if (this.canDrop) {
                this.updateDropIndicator(pointer.x);
                this.dropPet();
            }
        });
    }

    // Booster handling methods
    setActiveBooster(boosterName) {
        this.activeBooster = boosterName;
    }

    handleBoosterClick(pointer) {
        switch (this.activeBooster) {
            case 'hammer':
                this.useHammerBooster(pointer);
                break;
            case 'brush':
                this.useBrushBooster();
                break;
            case 'tornado':
                this.useTornadoBooster();
                break;
        }
    }

    useHammerBooster(pointer) {
        try {
            // Find pet at click position
            const clickedPet = this.findPetAtPosition(pointer.x, pointer.y);

            if (clickedPet) {
                // Create destruction effect
                this.createDestroyEffect(clickedPet.x, clickedPet.y);

                // Remove the pet
                this.removePet(clickedPet);

                // Notify booster scene
                this.events.emit('boosterUsed', 'hammer');
                this.activeBooster = null;
            }
        } catch (error) {
            console.error('Hammer booster error:', error);
            this.activeBooster = null;
        }
    }

    useBrushBooster() {
        try {
            // Find lowest level among current pets
            let lowestLevel = Infinity;
            for (const pet of this.pets) {
                if (pet && pet.active) {
                    const level = pet.getData('level');
                    if (level < lowestLevel) {
                        lowestLevel = level;
                    }
                }
            }

            if (lowestLevel === Infinity) {
                this.events.emit('boosterCancelled');
                this.activeBooster = null;
                return;
            }

            // Remove all pets of the lowest level
            const petsToRemove = this.pets.filter(pet =>
                pet && pet.active && pet.getData('level') === lowestLevel
            );

            for (const pet of petsToRemove) {
                this.createDestroyEffect(pet.x, pet.y);
                this.removePet(pet);
            }

            // Notify booster scene
            this.events.emit('boosterUsed', 'brush');
            this.activeBooster = null;
        } catch (error) {
            console.error('Brush booster error:', error);
            this.activeBooster = null;
        }
    }

    useTornadoBooster() {
        const c = GAME_CONFIG.container;

        // Apply random force to all pets (shuffle effect)
        for (const pet of this.pets) {
            if (pet.active && pet.body) {
                // Random horizontal force
                const forceX = (Math.random() - 0.5) * 0.05;
                const forceY = -Math.random() * 0.03; // Slight upward force

                pet.applyForce({ x: forceX, y: forceY });

                // Random position shift within container
                const newX = Phaser.Math.Clamp(
                    pet.x + (Math.random() - 0.5) * 100,
                    c.x + 50,
                    c.x + c.width - 50
                );
                pet.setPosition(newX, pet.y - 20);
            }
        }

        // Create tornado visual effect
        this.createTornadoEffect();

        // Notify booster scene
        this.events.emit('boosterUsed', 'tornado');
        this.activeBooster = null;
    }

    findPetAtPosition(x, y) {
        for (const pet of this.pets) {
            if (!pet.active) continue;

            const radius = pet.body.circleRadius || 30;
            const distance = Phaser.Math.Distance.Between(x, y, pet.x, pet.y);

            if (distance <= radius) {
                return pet;
            }
        }
        return null;
    }

    createDestroyEffect(x, y) {
        // Particle burst effect
        this.mergeEmitter.setPosition(x, y);
        this.mergeEmitter.setParticleTint(0xFF4444);
        this.mergeEmitter.explode(15);

        // Flash effect
        const flash = this.add.circle(x, y, 50, 0xFFFFFF, 0.8);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 300,
            onComplete: () => flash.destroy()
        });
    }

    createTornadoEffect() {
        const c = GAME_CONFIG.container;
        const centerX = c.x + c.width / 2;
        const centerY = c.y + c.height / 2;

        // Create swirl effect
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 4;
            const radius = 30 + i * 8;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius * 0.5;

            const particle = this.add.circle(x, y, 5, 0x88CCFF, 0.7);

            this.tweens.add({
                targets: particle,
                x: centerX,
                y: centerY,
                alpha: 0,
                scale: 0.1,
                duration: 500,
                delay: i * 30,
                onComplete: () => particle.destroy()
            });
        }
    }

    getRandomSpawnLevel() {
        // Use level-specific probabilities in adventure mode, or default
        const probabilities = this.levelProbabilities || GAME_CONFIG.defaultProbabilities;
        const weights = probabilities.map(p => p * 100);
        const total = weights.reduce((a, b) => a + b, 0);

        if (total === 0) return 1;

        let random = Math.random() * total;

        for (let i = 0; i < weights.length && i < GAME_CONFIG.maxSpawnLevel; i++) {
            random -= weights[i];
            if (random <= 0) {
                return i + 1;
            }
        }
        return 1;
    }

    dropPet() {
        try {
            debugLog('GameScene: dropPet called, canDrop =', this.canDrop, ', isGameOver =', this.isGameOver);
            if (!this.canDrop || this.isGameOver) {
                debugLog('GameScene: dropPet aborted - canDrop or isGameOver');
                return;
            }

            // Check moves in adventure mode
            if (this.gameMode === 'adventure') {
                if (this.movesLeft <= 0) {
                    debugLog('GameScene: dropPet - no moves left');
                    this.checkAdventureResult();
                    return;
                }
                this.movesLeft--;
                this.events.emit('movesUpdate', this.movesLeft);
            }

            this.canDrop = false;
            debugLog('GameScene: dropPet - canDrop set to false');

            const level = this.currentPetLevel;
            debugLog('GameScene: dropPet - level =', level);

            const petConfig = GAME_CONFIG.petSizes[level - 1];
            if (!petConfig) {
                debugError('GameScene: dropPet - invalid petConfig for level', level);
                this.canDrop = true;
                return;
            }
            debugLog('GameScene: dropPet - petConfig radius =', petConfig.radius);

            const cat = GAME_CONFIG.categories;
            debugLog('GameScene: dropPet - creating pet at', this.dropX, 210);

            // Create the pet with proper physics settings
            const pet = this.matter.add.image(this.dropX, 210, `pet_${level}`, null, {
                shape: { type: 'circle', radius: petConfig.radius },
                friction: GAME_CONFIG.physics.petFriction,
                frictionStatic: GAME_CONFIG.physics.petFrictionStatic,
                frictionAir: GAME_CONFIG.physics.frictionAir,
                restitution: GAME_CONFIG.physics.petRestitution,
                density: GAME_CONFIG.physics.petDensity,
                slop: GAME_CONFIG.physics.slop,
                label: 'pet',
                collisionFilter: {
                    category: cat.pet,
                    mask: cat.pet | cat.wall // Collide with pets and walls
                }
            });
            debugLog('GameScene: dropPet - pet created');

            pet.setData('level', level);
            pet.setData('canMerge', false); // Prevent immediate merge
            pet.setData('dropTime', this.time.now);

            this.pets.push(pet);
            debugLog('GameScene: dropPet - pet added to array, total:', this.pets.length);

            // Allow merging after delay
            this.time.delayedCall(GAME_CONFIG.mergeDelay, () => {
                if (pet && pet.active) {
                    pet.setData('canMerge', true);
                }
            });

            // Setup next pet
            this.currentPetLevel = this.nextPetLevel;
            this.nextPetLevel = this.getRandomSpawnLevel();
            debugLog('GameScene: dropPet - next levels:', this.currentPetLevel, this.nextPetLevel);

            // Update preview
            this.previewPet.setTexture(`pet_${this.currentPetLevel}`);

            // Emit update to UI
            this.events.emit('nextPetUpdate', this.nextPetLevel);

            // Cooldown before next drop
            this.time.delayedCall(GAME_CONFIG.dropCooldown, () => {
                this.canDrop = true;
                debugLog('GameScene: dropPet cooldown finished, canDrop = true');

                // Check if out of moves after cooldown
                if (this.gameMode === 'adventure' && this.movesLeft <= 0) {
                    this.time.delayedCall(500, () => this.checkAdventureResult());
                }
            });

            debugLog('GameScene: dropPet completed successfully');
        } catch (error) {
            debugError('Drop pet error:', error);
            this.canDrop = true; // Re-enable dropping on error
        }
    }

    setupCollisionDetection() {
        this.matter.world.on('collisionstart', (event) => {
            try {
                event.pairs.forEach((pair) => {
                    const bodyA = pair.bodyA;
                    const bodyB = pair.bodyB;

                    // Check if both are pets
                    if (bodyA && bodyB && bodyA.label === 'pet' && bodyB.label === 'pet') {
                        const petA = bodyA.gameObject;
                        const petB = bodyB.gameObject;

                        if (petA && petB && petA.active && petB.active) {
                            const levelA = petA.getData('level');
                            const levelB = petB.getData('level');
                            const canMergeA = petA.getData('canMerge');
                            const canMergeB = petB.getData('canMerge');

                            // Check if same level and both can merge
                            if (levelA === levelB && canMergeA && canMergeB) {
                                // Prevent double processing
                                if (!petA.getData('merging') && !petB.getData('merging') &&
                                    !petA.getData('destroyed') && !petB.getData('destroyed')) {
                                    petA.setData('merging', true);
                                    petB.setData('merging', true);
                                    petA.setData('canMerge', false);
                                    petB.setData('canMerge', false);

                                    // Queue the merge
                                    this.mergeQueue.push({ petA, petB, level: levelA });
                                    debugLog('GameScene: Merge queued, level =', levelA, ', queue size =', this.mergeQueue.length);
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Collision detection error:', error);
            }
        });
    }

    createMergeParticles() {
        this.mergeEmitter = this.add.particles(0, 0, 'merge_particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            emitting: false
        });
    }

    processMerges() {
        try {
            // Limit merges per frame to prevent freeze
            const maxMergesPerFrame = 5;
            let mergesProcessed = 0;

            while (this.mergeQueue.length > 0 && mergesProcessed < maxMergesPerFrame) {
                const merge = this.mergeQueue.shift();

                // Validate pets before merging
                if (merge.petA && merge.petB &&
                    merge.petA.active && merge.petB.active &&
                    !merge.petA.getData('destroyed') && !merge.petB.getData('destroyed')) {

                    debugLog('GameScene: Processing merge, queue length =', this.mergeQueue.length);
                    this.mergePets(merge.petA, merge.petB, merge.level);
                    mergesProcessed++;
                } else {
                    debugWarn('GameScene: Skipped invalid merge');
                }
            }

            // If there are remaining merges, process next frame
            if (this.mergeQueue.length > 0) {
                debugLog('GameScene: Remaining merges in queue:', this.mergeQueue.length);
            }
        } catch (error) {
            debugError('Merge processing error:', error);
            this.mergeQueue = []; // Clear queue to prevent repeated errors
        }
    }

    mergePets(petA, petB, level) {
        try {
            debugLog('GameScene: mergePets called, level =', level);
            if (!petA || !petB || !petA.active || !petB.active) {
                debugWarn('GameScene: mergePets aborted - invalid pets');
                return;
            }

            // Calculate merge position (midpoint)
            const mergeX = (petA.x + petB.x) / 2;
            const mergeY = (petA.y + petB.y) / 2;
            debugLog('GameScene: Merge position:', mergeX, mergeY);

            // Remove old pets
            this.removePet(petA);
            this.removePet(petB);
            debugLog('GameScene: Old pets removed');

            // Check if we can create a higher level pet
            const newLevel = level + 1;
            debugLog('GameScene: Creating new pet level', newLevel);

            if (newLevel <= GAME_CONFIG.petSizes.length) {
                // Create new merged pet
                const petConfig = GAME_CONFIG.petSizes[newLevel - 1];
                if (!petConfig) {
                    debugError('GameScene: Invalid pet config for level', newLevel);
                    return;
                }

                const cat = GAME_CONFIG.categories;
                debugLog('GameScene: Pet config:', petConfig.radius);

                const newPet = this.matter.add.image(mergeX, mergeY, `pet_${newLevel}`, null, {
                    shape: { type: 'circle', radius: petConfig.radius },
                    friction: GAME_CONFIG.physics.petFriction,
                    frictionStatic: GAME_CONFIG.physics.petFrictionStatic,
                    frictionAir: GAME_CONFIG.physics.frictionAir,
                    restitution: GAME_CONFIG.physics.petRestitution,
                    density: GAME_CONFIG.physics.petDensity,
                    slop: GAME_CONFIG.physics.slop,
                    label: 'pet',
                    collisionFilter: {
                        category: cat.pet,
                        mask: cat.pet | cat.wall
                    }
                });
                debugLog('GameScene: New pet created');

                newPet.setData('level', newLevel);
                newPet.setData('canMerge', false); // Prevent immediate re-merge
                newPet.setData('merging', false);
                newPet.setData('dropTime', this.time.now);

                // Allow merging after delay to prevent infinite loop
                this.time.delayedCall(GAME_CONFIG.mergeDelay, () => {
                    if (newPet && newPet.active) {
                        newPet.setData('canMerge', true);
                        debugLog('GameScene: Merged pet now can merge, level =', newLevel);
                    }
                });

                // Pop-in animation
                newPet.setScale(0.1);
                this.tweens.add({
                    targets: newPet,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Back.out'
                });
                debugLog('GameScene: Tween added');

                this.pets.push(newPet);
                debugLog('GameScene: Pet added to array, total:', this.pets.length);

                // Particle effect - with safety check
                try {
                    if (this.mergeEmitter) {
                        this.mergeEmitter.setPosition(mergeX, mergeY);
                        const particleColor = GAME_CONFIG.petColors[newLevel - 1] || 0xFFFFFF;
                        this.mergeEmitter.setParticleTint(particleColor);
                        this.mergeEmitter.explode(10);
                        debugLog('GameScene: Particle effect done');
                    }
                } catch (particleError) {
                    debugWarn('GameScene: Particle effect failed:', particleError);
                }

                // Track goal progress in adventure mode
                if (this.gameMode === 'adventure') {
                    this.updateGoalProgress(newLevel);
                }
            } else {
                debugLog('GameScene: Max level reached, no new pet created');
            }

            // Add score based on pet config
            const scoreGain = GAME_CONFIG.petSizes[level - 1]?.score || level * 10;
            this.score += scoreGain;
            debugLog('GameScene: Score added:', scoreGain, 'total:', this.score);

            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('petmerge_highscore', this.highScore.toString());
            }

            // Emit score update
            this.events.emit('scoreUpdate', this.score, this.highScore);

            // Show floating score text
            this.showFloatingScore(mergeX, mergeY, scoreGain);
            debugLog('GameScene: mergePets completed successfully');
        } catch (error) {
            debugError('Merge pets error:', error);
        }
    }

    // Adventure mode goal tracking
    updateGoalProgress(petLevel) {
        if (!this.goalProgress) return;

        // Check each goal
        for (const key in this.goalProgress) {
            const goal = this.goalProgress[key];
            if (goal.petLevel === petLevel && goal.current < goal.target) {
                goal.current++;

                // Emit goal update
                this.events.emit('goalUpdate', this.goalProgress);

                // Check if all goals completed
                if (this.areAllGoalsCompleted()) {
                    this.time.delayedCall(500, () => this.triggerAdventureWin());
                }
                break;
            }
        }
    }

    areAllGoalsCompleted() {
        for (const key in this.goalProgress) {
            const goal = this.goalProgress[key];
            if (goal.current < goal.target) {
                return false;
            }
        }
        return true;
    }

    checkAdventureResult() {
        if (this.isGameOver) return;

        if (this.areAllGoalsCompleted()) {
            this.triggerAdventureWin();
        } else {
            this.triggerAdventureLose();
        }
    }

    triggerAdventureWin() {
        this.isGameOver = true;
        this.canDrop = false;

        // Calculate stars based on moves remaining
        let stars = 1;
        const levelData = typeof LEVEL_DATA !== 'undefined' ? LEVEL_DATA[this.adventureLevel - 1] : null;
        if (levelData) {
            const movesUsedPercent = (levelData.moves - this.movesLeft) / levelData.moves;
            if (movesUsedPercent <= 0.5) stars = 3;
            else if (movesUsedPercent <= 0.75) stars = 2;
        }

        // Unlock next level
        const currentMaxLevel = parseInt(localStorage.getItem('petmerge_adventure_level') || '1');
        if (this.adventureLevel >= currentMaxLevel) {
            localStorage.setItem('petmerge_adventure_level', (this.adventureLevel + 1).toString());
        }

        // Save stars
        const starsData = JSON.parse(localStorage.getItem('petmerge_level_stars') || '{}');
        if (!starsData[this.adventureLevel] || starsData[this.adventureLevel] < stars) {
            starsData[this.adventureLevel] = stars;
            localStorage.setItem('petmerge_level_stars', JSON.stringify(starsData));
        }

        // Emit win event
        this.events.emit('adventureWin', {
            level: this.adventureLevel,
            stars: stars,
            score: this.score
        });
    }

    triggerAdventureLose() {
        this.isGameOver = true;
        this.canDrop = false;

        // Emit lose event
        this.events.emit('adventureLose', {
            level: this.adventureLevel,
            goalProgress: this.goalProgress
        });
    }

    removePet(pet) {
        try {
            if (!pet) return;

            // Mark as destroyed to prevent stale references
            pet.setData('destroyed', true);
            pet.setData('canMerge', false);

            const index = this.pets.indexOf(pet);
            if (index > -1) {
                this.pets.splice(index, 1);
            }
            if (pet.active) {
                pet.destroy();
            }
            debugLog('GameScene: Pet removed, remaining pets:', this.pets.length);
        } catch (error) {
            debugError('Remove pet error:', error);
        }
    }

    showFloatingScore(x, y, score) {
        const text = this.add.text(x, y, `+${score}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    checkGameOver() {
        if (this.isGameOver) return;

        try {
            // Check if any pet is above the danger line for too long
            const now = this.time.now;
            let petAboveLine = false;

            for (const pet of this.pets) {
                // Safety check for invalid pets
                if (!pet || !pet.active || pet.getData('destroyed')) continue;

                const dropTime = pet.getData('dropTime');
                if (dropTime === undefined || dropTime === null) continue;

                const timeSinceDrop = now - dropTime;

                // Only check pets that have been in play for a while
                if (timeSinceDrop > 1000) {
                    if (pet.y < GAME_CONFIG.boundaryLineY) {
                        petAboveLine = true;

                        // Flash the danger line
                        if (this.dangerLine && this.dangerLine.active) {
                            this.dangerLine.setAlpha(0.8);
                        }

                        if (!this.gameOverCheckTimer) {
                            this.gameOverCheckTimer = now;
                        } else if (now - this.gameOverCheckTimer > GAME_CONFIG.gameOverDelay) {
                            this.triggerGameOver();
                            return;
                        }
                    }
                }
            }

            if (!petAboveLine) {
                this.gameOverCheckTimer = null;
                if (this.dangerLine && this.dangerLine.active) {
                    this.dangerLine.setAlpha(0.3);
                }
            }
        } catch (error) {
            debugError('GameScene: checkGameOver error:', error);
        }
    }

    triggerGameOver() {
        this.isGameOver = true;
        this.canDrop = false;

        // Emit game over event
        this.events.emit('gameOver', this.score, this.highScore);

        // Dim the game
        this.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
            if (progress === 1) {
                this.cameras.main.resetFX();
                this.cameras.main.setAlpha(0.5);
            }
        });
    }

    restartGame() {
        // Destroy all pets
        this.pets.forEach(pet => {
            if (pet.active) pet.destroy();
        });

        // Reset camera
        this.cameras.main.setAlpha(1);

        // Restart scene
        this.scene.restart();
    }

    update() {
        if (this.isGameOver) return;

        try {
            // Clean up invalid pets from array periodically
            this.cleanupPetsArray();

            // Process any pending merges
            this.processMerges();

            // Check for game over condition
            this.checkGameOver();

            // Safety check: ensure pets stay within bounds
            this.constrainPets();
        } catch (error) {
            debugError('GameScene: Update error:', error);
            // Continue game loop despite errors
        }
    }

    // Remove invalid/destroyed pets from the array
    cleanupPetsArray() {
        const beforeCount = this.pets.length;
        this.pets = this.pets.filter(pet => {
            return pet && pet.active && !pet.getData('destroyed');
        });
        const afterCount = this.pets.length;

        if (beforeCount !== afterCount) {
            debugLog('GameScene: Cleaned up', beforeCount - afterCount, 'invalid pets');
        }
    }

    // Additional safety measure to keep pets inside container
    constrainPets() {
        try {
            const c = GAME_CONFIG.container;

            for (const pet of this.pets) {
                // Enhanced safety check
                if (!pet || !pet.active || !pet.body || pet.getData('destroyed')) continue;

                const radius = pet.body.circleRadius || 20;
                const minX = c.x + radius;
                const maxX = c.x + c.width - radius;
                const maxY = c.y + c.height - radius;

                // If pet somehow escapes, push it back
                if (pet.x < minX) {
                    pet.setPosition(minX + 5, pet.y);
                    if (pet.body && pet.body.velocity) {
                        pet.setVelocityX(Math.abs(pet.body.velocity.x) * 0.5);
                    }
                }
                if (pet.x > maxX) {
                    pet.setPosition(maxX - 5, pet.y);
                    if (pet.body && pet.body.velocity) {
                        pet.setVelocityX(-Math.abs(pet.body.velocity.x) * 0.5);
                    }
                }
                if (pet.y > maxY) {
                    pet.setPosition(pet.x, maxY - 5);
                    if (pet.body && pet.body.velocity) {
                        pet.setVelocityY(-Math.abs(pet.body.velocity.y) * 0.3);
                    }
                }
            }
        } catch (error) {
            debugError('Constrain pets error:', error);
        }
    }

    // Safe remove pet with null check
    safeRemovePet(pet) {
        try {
            if (pet && this.pets) {
                const index = this.pets.indexOf(pet);
                if (index > -1) {
                    this.pets.splice(index, 1);
                }
                if (pet.active) {
                    pet.destroy();
                }
            }
        } catch (error) {
            console.error('Safe remove pet error:', error);
        }
    }
}
