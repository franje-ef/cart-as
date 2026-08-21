class GameHubSender {
    gameHub: GameHub;

    constructor(gameHub : GameHub) {
        this.gameHub = gameHub;
    }

    startGame() {
        this.gameHub.hub.invoke("StartGame");
    }

    changeGoal() {
        this.gameHub.hub.invoke("ChangeGoal");
    }

    playCard(num, suit) {
        return this.gameHub.hub.invoke("PlayCard", num, suit);
    }

    takeDeckCard() {
        return this.gameHub.hub.invoke("TakeDeckCard");
    }

    takePlayedCard() {
        return this.gameHub.hub.invoke("TakePlayedCard");
    }

    sendReaction(reactionId) {
        this.gameHub.hub.invoke("SendReaction", reactionId);
    }

    removePlayer(seat) {
        this.gameHub.hub.invoke("RemovePlayer", seat);
    }

    claimVictory() {
        this.gameHub.hub.invoke("ClaimVictory");
    }

}
