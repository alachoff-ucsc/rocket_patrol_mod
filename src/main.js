// POINT BREAKDOWN: 
// Starting tier: 30 pts ( everything except the last one )
// Novice tier: 0 pts
// Intermediate tier: 0 pts
// S(hrek) tier: 0 pts
// #FACADE tier: 0 pts
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}
let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
