class GameHubReceiver {
    constructor(gameHub, players) {
        this.gameHub = gameHub;
        this.players = players;
    }

    init() {
        const self = this;
        this.gameHub.hub.client.playerConnected = function (player) {
            self.players.addPlayer(player.PlayerId, player.PlayerName, '/Content/img/avatars/' + player.Avatar, player.Seat, player.WinCount);
        }

        this.gameHub.hub.client.onGameStarted = function() {
            location.reload();
        }
    }
}