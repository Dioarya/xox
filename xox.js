// Made by Dio Arya Raditya.
let gameData;
let gameState;
let playerData;
let screenData;
let w, h;
let moves;
let drawableObjects;
let clicked;

// Todo: Add sound effects
// Todo: Use textures or hand animate new ones
// Todo: Add a vs bot mode
// Todo: Add multiple players (probably will have to use only color and circles as pieces)
// Todo: Add a menu to change the settings.
// Todo: 
// Todo: Make this into a ts file (really hard probably 😢)
// Todo: Make the curresnt score viewer better

// Currently working on:

// Done:
// Todo: Add a way to view the current score of each player

function setup() {
    defineVariables()
    createCanvas(screenData.width, screenData.height);
    fullscreen();
    clicked = false;
    drawableObjects = [];
    w = width / gameData.cols;
    h = height / gameData.rows;
    gameData.grid = create2DArray(gameData.cols, gameData.rows, undefined);
    useSound = false;
    moves = [];
    for (let i = 0; i < 2; i++) {
        gameData.count.push(0);
        gameData.lines.push([]);
    }
}
function draw() {
    background(52);

    strokeWeight(1 * screenData.strokeRatio);
    stroke(0);

    for (let i = 1; i < gameData.rows; i++) {
        line(i * w, 0, i * w, height);
    }
    for (let j = 1; j < gameData.cols; j++) {
        line(0, j * h, width, j * h);
    }

    for (let object of drawableObjects) {
        object.update();
        object.show();
    }

    if (gameState.highlight) {
        let x = max(0, floor(mouseX / w));
        let y = max(0, floor(mouseY / h));
        stroke(playerData.playerColor[playerData.active]);
        strokeWeight(2 * screenData.strokeRatio);
        fill(255, 255, 255, 64);
        rect(x * w, y * h, w, h);
    }


    // tutorial
    if (!clicked) {

        noStroke();
        fill(0, 255, 0);
        textSize(32);
        textAlign(CENTER, TOP);
        text("Press any square to place a piece down.\n A player gets a point when they line up 3 of their pieces in a\nhorizontal, vertical, or diagonal way.\n When the board is full, the game ends\nand the points are tallied up to see who wins.", width / 2, height / 2);
    }

    if (gameState.ended()) {
        endGame()
        strokeWeight(1 * screenData.strokeRatio);
        // Draw darker screen
        fill(0, 0, 0, 52);
        rect(0, 0, width, height);

        fill(255, 255, 255);
        textSize(32);
        textAlign(CENTER, CENTER);
        if (gameState.win) {
            let player = gameState.endState.player;
            let winnerCount = gameState.endState.winnerCount;
            let loserCount = gameState.endState.loserCount;
            let count = winnerCount - loserCount;
            let playerName = playerData.playerName[player];
            let playerColor = playerData.playerColor[player];

            // Draw dark area
            stroke(playerColor);
            fill(0, 0, 0, 100);
            rect(0, height / 3, width, height / 3);

            fill(255, 255, 255)
            let pointString;
            if (count === 1) pointString = "point";
            if (count > 1) pointString = "points";
            text(playerName + " won by " + count.toString() + " " + pointString + ".", width / 2, height / 2);
        } else if (gameState.tie) {
            // Draw dark area
            stroke(playerColor);
            fill(0, 0, 0, 100);
            rect(0, height / 3, width, height / 3);
            text("It's a tie.", width / 2, height / 2);
        }
    } else {
        noStroke();
        fill(0, 255, 0);
        textSize(20);
        textAlign(LEFT, TOP);

        text(playerData.playerName[0] + ": " + gameData.count[0] + "\n" + playerData.playerName[1] + ": " + gameData.count[1], width / 100, width / 100)
    }
}

function check(player, position) {
    let gc = gameData.checkSize;
    let horizontal = [], vertical = [], diagonal1 = [], diagonal2 = [];
    for (let i = 0; i < gc; i++) {
        horizontal.push([i, 0]);
        vertical.push([0, i]);
        diagonal1.push([i, i]);
        diagonal2.push([gc - i - 1, i]);
    }
    let patterns = [horizontal, vertical, diagonal1, diagonal2];
    // This piece of code lets the line go from the farthest piece to the piece placed to form the line farthest piece -> placed piece
    // Example:
    // O: already placed piece
    // X: piece placed
    // O   = 1
    //  O  =  2
    //   X =   3
    // X   = 3
    //  O  =  2
    //   O =   1
    for (let pattern of patterns) for (let centeri = 0; centeri < gc; centeri++) {
        let candidate = { pieces: [], line: [] };
        // let candidate = { line: [] };
        let coords = [];
        for (let i of pattern) coords.push(i);

        let halfway = centeri / (pattern.length - 1) < 0.5;
        if (halfway) coords.reverse();

        let center = pattern[centeri];
        for (let coord of coords) {
            let x = position[0] - center[0] + coord[0];
            let y = position[1] - center[1] + coord[1];
            if (!withinBounds(x, y)) break;
            let piece = gameData.grid[y][x];
            if (piece?.player !== player) break;
            candidate.line.push([x, y]);
            candidate.pieces.push(piece);
        }
        if (!(candidate.line.length === gc)) continue;

        gameData.count[player]++;
        let color = playerData.playerColor[player];
        let newLine = new Line(candidate.line, [w, h], color);
        drawableObjects.push(newLine);
        gameData.lines[player].push(newLine);
    }

    for (let row of gameData.grid) for (let piece of row) if (piece === undefined) return;
    endGame();
}
function mousePressed() {
    if (gameState.ended()) {
        restart();
        return;
    }
    clicked = true;

    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    if (withinBounds(i, j) && gameData.grid[j][i] === undefined) placePiece(i, j);
}
function placePiece(i, j) {
    let p = playerData.active;
    let color = playerData.playerColor[p];
    let piece = new Piece([i, j], [w, h], p, color, Boolean(p));
    drawableObjects.push(piece);
    gameData.grid[j][i] = piece;
    moves.push([i, j]);
    playerData.active = 1 - playerData.active;
    check(p, [i, j]);
}
// Todo: make a support for multiplayer
function endGame() {
    gameState.highlight = false;
    let a = gameData.count[0];
    let b = gameData.count[1];
    if (a === b) {
        gameState.tie = true;
        return;
    }
    gameState.win = true;


    let winner = b > a ? 1 : 0;
    gameState.endState.player = winner;
    gameState.endState.winnerCount = gameData.count[winner];
    gameState.endState.loserCount = gameData.count[1 - winner];
}

function create2DArray(rows, cols, fill) {
    let arr = [];
    for (let j = 0; j < cols; j++) {
        arr.push([]);
        for (let i = 0; i < rows; i++) {
            arr[j][i] = fill;
        }
    }
    return arr;
}
function withinBounds(x, y) {
    return x >= 0 && x < gameData.rows && y >= 0 && y < gameData.cols;
}
function getMoves() {
    return moves;
}
function restart() {
    setup();
}

