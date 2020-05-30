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
        this.gameHub.hub.client.playerConnected = player => {
            this.players.addPlayer(player.PlayerId, player.PlayerName, player.Avatar, player.Seat, player.WinCount);
        }

        this.gameHub.hub.client.onGameStarted = () => {
            location.reload();
        }

        this.gameHub.hub.client.onGoalChanged = goal => {
            this.romi.onGoalChanged(goal);
        }

        this.gameHub.hub.client.onCardPlayed = (seat, num, suit) => {
            this.playedCard.setPlayedCard(seat, num, suit);
        }

        this.gameHub.hub.client.onTurnChanged = seat => {
            this.players.setCurrentTurn(seat); 
        }

        this.gameHub.hub.client.onPlayedCardTaken = () => {
            this.playedCard.removePlayedCard();
        }

        this.gameHub.hub.client.onReactionSent = (seat, reactionId) => {
            this.reactionService.onReactionSent(seat, reactionId);
        }

        this.gameHub.hub.client.onPlayerRemoved = (seat, removedPlayerId) => {
            this.players.onPlayerRemoved(seat, removedPlayerId);
        }

        this.gameHub.hub.client.onPlayerClaimedVictory = playerId => {
            this.game.showPotentialWinner(playerId);
        }

        this.gameHub.hub.client.onPlayerClaimingVictoryLost = () =>{
            this.confirmVictory.hide();
        }

        this.gameHub.hub.client.onPlayerWon = playerId =>{
            this.game.showWinner(playerId);
        }
    }
}