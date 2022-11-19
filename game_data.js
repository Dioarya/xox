// Made by Dio Arya Raditya.

function defineVariables() {
    screenData = {
        width: 1000,
        height: 1000,
    };
    screenData.strokeRatio = Math.min(screenData.width, screenData.height) / 1000;

    gameData = {
        lines: [],
        grid: undefined,
        cols: 8,
        rows: 8,
        checkSize: 3,
        count: []
    };

    gameState = {
        highlight: true,
        ended: () => { return gameState.win || gameState.tie },
        win: false,
        tie: false,
        endState: {
            winnerCount: undefined,
            loserCount: undefined,
            player: undefined // Player that has the most points
        }
    };

    playerData = {
        active: 0,
        players: 2,
        playerColor: [[200, 0, 0], [255, 165, 0]],
        playerName: ["Red", "Yellow"],
        cyclePlayers: () => { playerData.active = (playerData.active + 1) % playerData.players }

    };
}