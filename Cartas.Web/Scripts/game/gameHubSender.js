class GameHubSender {
    constructor(gameHub) {
        this.gameHub = gameHub;
    }

    init() {
        
    }

    startGame() {
        this.gameHub.hub.server.startGame();
    }
}