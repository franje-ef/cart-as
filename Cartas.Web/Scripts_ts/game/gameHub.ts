class GameHub {
    hub: any;
    gameId: string;
    playerId: string;

    constructor(gameId: string, playerId: string) {
        this.gameId = gameId;
        this.playerId = playerId;
    }

    init() {
        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(`/hubs/game?PlayerId=${this.playerId}&GameId=${this.gameId}`)
            .build();
    }

    connect() {
        this.hub.start();
    }
}
