class GameHubReceiver {
    game: Game;
    gameHub: GameHub;
    players: Players;
    romi: Romi;
    playedCard: PlayedCard;
    reactionService: ReactionService;
    confirmVictory: ConfirmVictory;

    constructor(game: Game, gameHub : GameHub, players: Players, romi: Romi, playedCard: PlayedCard, reactionService: ReactionService, confirmVictory: ConfirmVictory) {
        this.gameHub = gameHub;
        this.players = players;
        this.romi = romi;
        this.playedCard = playedCard;
        this.reactionService = reactionService;
        this.confirmVictory = confirmVictory;
        this.game = game;
    }

    init() {
        this.gameHub.hub.on("playerConnected", player => {
            this.players.addPlayer(player.PlayerId, player.PlayerName, player.Avatar, player.Seat, player.WinCount);
        });

        this.gameHub.hub.on("onGameStarted", () => {
            location.reload();
        });

        this.gameHub.hub.on("onGoalChanged", goal => {
            this.romi.onGoalChanged(goal);
        });

        this.gameHub.hub.on("onCardPlayed", (seat, num, suit) => {
            this.playedCard.setPlayedCard(seat, num, suit);
        });

        this.gameHub.hub.on("onTurnChanged", seat => {
            this.players.setCurrentTurn(seat);
        });

        this.gameHub.hub.on("onPlayedCardTaken", () => {
            this.playedCard.removePlayedCard();
        });

        this.gameHub.hub.on("onReactionSent", (seat, reactionId) => {
            this.reactionService.onReactionSent(seat, reactionId);
        });

        this.gameHub.hub.on("onPlayerRemoved", (seat, removedPlayerId) => {
            this.players.onPlayerRemoved(seat, removedPlayerId);
        });

        this.gameHub.hub.on("onPlayerClaimedVictory", playerId => {
            this.game.showPotentialWinner(playerId);
        });

        this.gameHub.hub.on("onPlayerClaimingVictoryLost", () => {
            this.confirmVictory.hide();
        });

        this.gameHub.hub.on("onPlayerWon", playerId => {
            this.game.showWinner(playerId);
        });
    }
}
