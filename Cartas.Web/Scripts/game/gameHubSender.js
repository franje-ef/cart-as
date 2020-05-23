class GameHubSender {
    constructor(gameHub) {
        this.gameHub = gameHub;
    }

    init() {
        
    }

    startGame() {
        this.gameHub.hub.server.startGame();
    }

    changeGoal() {
        this.gameHub.hub.server.changeGoal();
    }

    playCard(num, suit) {
        return this.gameHub.hub.server.playCard(num, suit);
    }
}