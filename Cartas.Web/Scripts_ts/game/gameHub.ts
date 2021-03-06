﻿class GameHub {
    hub: any;
    gameId: string;
    playerId: string;

    constructor(gameId: string, playerId: string) {
        this.gameId = gameId;
        this.playerId = playerId;
    }

    init() {
        this.hub = $.connection["gameHub"];
    }

    connect() {
        $.connection.hub.qs = { "PlayerId": this.playerId, "GameId": this.gameId };
        $.connection.hub.start().done(function () {
            //lobby.server.playerConnected('@Model.ThisPlayer.PlayerId', '@Model.ThisPlayer.Name', '@Model.GameId');
        });
    }

   
}