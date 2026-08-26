class CatanHub {
    hub: any;
    gameId: string;
    playerId: string;

    constructor(gameId: string, playerId: string) {
        this.gameId = gameId;
        this.playerId = playerId;
    }

    init() {
        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(`/hubs/catan?PlayerId=${this.playerId}&GameId=${this.gameId}`)
            .build();
    }

    connect() {
        this.hub.start();
    }

    startGame() {
        this.hub.invoke("StartGame");
    }

    removePlayer(seat: number) {
        this.hub.invoke("RemovePlayer", seat);
    }
}
