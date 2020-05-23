class GameHub {
    constructor(gameId, playerId, players) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.players = players;
    }

    init() {
        var hub = $.connection.gameHub;

        const self = this;
        hub.client.playerConnected = function (player) {
            self.players.addPlayer(player.PlayerId, player.PlayerName, '/Content/img/avatars/' + player.Avatar , player.Seat, player.WinCount);
        }

        //hub.client.playerDisconnected = function (playerId) {
        //    removePlayer(playerId);
        //}

        //hub.client.redirectToGame = function () {
        //    redirectToGame();
        //}

        // Start the connection.
        $.connection.hub.qs = { "PlayerId": this.playerId, "GameId": this.gameId };
        $.connection.hub.start().done(function () {
            //lobby.server.playerConnected('@Model.ThisPlayer.PlayerId', '@Model.ThisPlayer.Name', '@Model.GameId');
        });
    }
}