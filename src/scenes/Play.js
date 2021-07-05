class Play extends Phaser.Scene {
    constructor () {
        super("playScene")
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        // load spritesheets
        this.load.spritesheet('starfield', './assets/starfield_tile.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load bgm
        this.load.audio('bgm', './assets/rocketpatrolbgm.wav')
    }

    create() {
        
        // animate the tile sprite
        this.anims.create({
            key: 'stars',
            frames: this.anims.generateFrameNumbers('starfield', { start: 0, end: 15 }),
            frameRate: 4 * game.settings.bgmRate,
            repeat: -1
        });
        // place tile sprite for starfield and animate it
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // this.starfield.anims.play('stars');
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.width, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.width, 0xFFFFFF).setOrigin(0, 0);
        // bgm
        this.bgm = this.sound.add('bgm');
        this.bgm.play({rate: game.settings.bgmRate, loop: true});
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, Math.floor(Math.random() * 2), 30);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, Math.floor(Math.random() * 2), 20);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, Math.floor(Math.random() * 2), 10);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config for explosion
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // initialize topscore
        if (typeof this.topScore === 'undefined') {
            this.topScore = 0;
        }
        // console.log(this.topScore);
        // display topscore
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, this.topScore, scoreConfig).setOrigin(1, 0);
        // initialize fireText
        this.fireText = this.add.text(game.config.width / 2, borderUISize + borderPadding*2, 'FIRE', {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }).setOrigin(0.5, 0);


        // GAME OVER flag
        this.gameOver = false;

        // variable clock (for game over)
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // variable clock (halfway point)
        this.halfpoint = false
        this.speedUp = this.time.delayedCall(game.settings.gameTimer / 2, () => {
            // increase ship speed
            this.ship01.moveSpeed += 2
            this.ship02.moveSpeed += 2
            this.ship03.moveSpeed += 2
            this.halfpoint = true;
        }, null, this);

    }

    update() {
        // game over stuff
        if (this.gameOver) {
            // slow music down
            if (this.bgm.rate > 0.1) {
                this.bgm.setRate(this.bgm.rate - 0.01)
            }
            // update topScore
            if (this.p1Score > this.topScore) {
                this.topScore = this.p1Score
            }
            // restart
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart();
                this.sound.stopAll();
            }
            // to menu
            else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start('menuScene')
                this.sound.stopAll();
            }  
        }

        // increase bgm speed at halfway point
        if (this.halfpoint && !this.gameOver && this.bgm.rate < game.settings.bgmRate + 0.2) {
            this.bgm.setRate(this.bgm.rate + 0.01)
        }

        // scroll the starfield texture 
        this.starfield.tilePositionX -= 1;
        this.starfield.tilePositionY -= 1;

        // display FIRE text when firing
        if (this.p1Rocket.isFiring) {
            this.fireText.setVisible(true)
        }
        else {
            this.fireText.setVisible(false)
        }

        // updates spaceships x3
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        // temporarily hide the ship
        ship.alpha = 0;
        // create explosion sprite at ship's pos
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score increment 
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}