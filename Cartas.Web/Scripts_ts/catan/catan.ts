class Catan {
    gameId: string;
    playerId: string;
    isMasterUser: boolean;
    gameStarted: boolean;
    players: Array<any>;
    catanHub: CatanHub;

    constructor(gameId: string, playerId: string, isMasterUser: boolean, gameStarted: boolean, players: Array<any>) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.isMasterUser = isMasterUser;
        this.gameStarted = gameStarted;
        this.players = players;
    }

    init() {
        this.renderPlayers();

        this.catanHub = new CatanHub(this.gameId, this.playerId);
        this.catanHub.init();

        this.catanHub.hub.on("playerConnected", player => {
            if (!this.players.some(p => p.playerId === player.PlayerId)) {
                this.players.push({ playerId: player.PlayerId, playerName: player.PlayerName, avatar: player.Avatar, seat: player.Seat });
                this.renderPlayers();
            }
        });

        this.catanHub.hub.on("onGameStarted", () => {
            location.reload();
        });

        this.catanHub.hub.on("onPlayerRemoved", (seat, removedPlayerId) => {
            this.players = this.players.filter(p => p.playerId !== removedPlayerId);
            this.renderPlayers();
        });

        this.catanHub.connect();

        const startButton = document.getElementById("startGameBtn");
        if (startButton) {
            startButton.addEventListener("click", () => this.catanHub.startGame());
        }
    }

    private renderPlayers() {
        const list = document.getElementById("catanPlayerList");
        if (!list) return;

        list.innerHTML = "";
        this.players.forEach(player => {
            const item = document.createElement("li");
            item.textContent = `${player.playerName} (asiento ${player.seat})`;
            list.appendChild(item);
        });
    }
}
