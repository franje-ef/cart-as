class ConfirmVictory {
    constructor(game, board, playerDeckWidth) {
        this.game = game;
        this.board = board;
        this.playerDeckWidth = playerDeckWidth;
    }

    init() {
        const container = new PIXI.Container();
        container.visible = false;
        container.x = (this.game.width - this.playerDeckWidth / 2) / 2;
        container.y = 350;

        this.container = container;
        this.game.app.stage.addChild(this.container);
    }

    show(playerName) {
        for (var i = this.container.children.length - 1; i >= 0; i--) {
             this.container.removeChild(this.container.children[i]);
        };
        
        this.board.hide();
        
        const snapshot = new PIXI.Sprite.from("/game/snapshot?gameid=" + game.gameId);
        snapshot.scale.x = 0.5;
        snapshot.scale.y = 0.5;
        snapshot.y = 50;
        this.container.addChild(snapshot);

        document.fonts.load('8pt "Cabin Sketch"').then(() => this._showPlayerName(playerName, this.container, this.playerDeckWidth));

        this.container.visible = true;
    }

    hide() {
        this.board.show();

        this.container.visible = false;
    }

    _showPlayerName(playerName, container, width) {
        var potentialWinner = new PIXI.Text("¡" + playerName + " dice que ha ganado!",
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 42,
                fill: 0xffffff,
                fontWeight: "500",
                lineHeight: 4
            });
        potentialWinner.x = (width/2 - potentialWinner.width) / 2;
        potentialWinner.y = 0;

        container.addChild(potentialWinner);
    }

}