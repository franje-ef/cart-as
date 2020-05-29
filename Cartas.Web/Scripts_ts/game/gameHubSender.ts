class GameHubSender {
    gameHub: GameHub;

    constructor(gameHub : GameHub) {
        this.gameHub = gameHub;
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

    takeDeckCard() {
        return this.gameHub.hub.server.takeDeckCard();
    }

    takePlayedCard() {
        return this.gameHub.hub.server.takePlayedCard();
    }

    sendReaction(reactionId) {
        this.gameHub.hub.server.sendReaction(reactionId);
    }

    removePlayer(seat) {
        this.gameHub.hub.server.removePlayer(seat);
    }

    claimVictory() {
        this.gameHub.hub.server.claimVictory();
    }

}