class GameHubReceiver {
    constructor(gameHub, players, romi, playedCard, reactionService) {
        this.gameHub = gameHub;
        this.players = players;
        this.romi = romi;
        this.playedCard = playedCard;
        this.reactionService = reactionService;
    }

    init() {
        const self = this;
        this.gameHub.hub.client.playerConnected = function (player) {
            self.players.addPlayer(player.PlayerId, player.PlayerName, '/Content/img/avatars/' + player.Avatar, player.Seat, player.WinCount);
        }

        this.gameHub.hub.client.onGameStarted = function() {
            location.reload();
        }

        this.gameHub.hub.client.onGoalChanged = function (goal) {
            self.romi.onGoalChanged(goal);
        }

        this.gameHub.hub.client.onCardPlayed = function(seat, num, suit) {
            self.playedCard.setPlayedCard(seat, num, suit);
        }

        this.gameHub.hub.client.onTurnChanged = function(seat) {
            self.players.setCurrentTurn(seat); 
        }

        this.gameHub.hub.client.onPlayedCardTaken = function() {
            self.playedCard.removePlayedCard();
        }

        this.gameHub.hub.client.onReactionSent = function(seat, reactionId) {
            self.reactionService.onReactionSent(seat, reactionId);
        }
    }
}