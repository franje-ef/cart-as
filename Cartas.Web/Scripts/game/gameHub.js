class GameHub {
    constructor(gameId, playerId) {
        this.gameId = gameId;
        this.playerId = playerId;
    }

    init() {
        this.hub = $.connection.gameHub;
        

        //hub.client.playerDisconnected = function (playerId) {
        //    removePlayer(playerId);
        //}

        //hub.client.redirectToGame = function () {
        //    redirectToGame();
        //}

        // Start the connection.
        
    }

    connect() {
        $.connection.hub.qs = { "PlayerId": this.playerId, "GameId": this.gameId };
        $.connection.hub.start().done(function () {
            //lobby.server.playerConnected('@Model.ThisPlayer.PlayerId', '@Model.ThisPlayer.Name', '@Model.GameId');
        });
    }
}