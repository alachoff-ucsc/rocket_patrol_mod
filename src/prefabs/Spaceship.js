// spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, direction, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame
        this.direction = direction
        if (this.direction == 1) {
            this.flipX = true
        }
        this.setOrigin(this.direction, 0)
    }

    update() {
        // point and move spaceship in a direction
        if (this.direction == 0) {
            this.x -= this.moveSpeed;
        }
        else {
            this.x += this.moveSpeed;
        }
        
        // wrap around from left edge to right edge
        if(this.x <=0 - this.width || this.x >= game.config.width + this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        if (this.direction == 0) {
            this.x = game.config.width;
        }
        else {
            this.x = 0;
        }
        
    }
}