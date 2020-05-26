class GameControls {
    constructor(game, isMasterUser, resources, gameHubSender, playerDeck) {
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.resources = resources;
        this.gameHubSender = gameHubSender;
        this.playerDeck = playerDeck;
    }

    init() {
        var container = new PIXI.Container();
        container.x = this.game.width - 120;

        this._createButton(this.resources, container, "exit", () => this._onExitPressed());
        this._createButton(this.resources, container, "shuffle", () => this._onShufflePressed());
        this._createButton(this.resources, container, "victory", () => this._onVictoryPressed());
        if (this.isMasterUser) {
            this._createButton(this.resources, container, "start", () => this._onStartPressed());
        }


        this.game.stage.addChild(container);
    }

    _createButton(resources, container, resourceId, func) {
        var button = new PIXI.Sprite(resources[resourceId].texture);
        button.height = 90;
        button.width = 90;
        button.y = container.height;
        button.interactive = true;
        button.buttonMode = true;

        button.mousedown = button.touchstart = function (event) {
            var target = event.target;
            var original = target.height;

            target.height = original * 2;
            target.width = original * 2;

            TweenLite.to(target, 0.4, {
                height: original,
                width: original,
                ease: Elastic.easeOut
            });

            func();
        }

        container.addChild(button);
    }

    _onExitPressed() {
        window.location.href = "/";
    }

    _onShufflePressed() {
        location.reload();
    }

    _onStartPressed() {
        this.gameHubSender.startGame();
    }

    _onVictoryPressed() {
        const snapshot = this.playerDeck.getSnapshotBase64();
        const self = this;
        $.post("/game/snapshot",
                {
                    gameId: this.game.gameId,
                    base64: snapshot
                })
            .done(function (data) {
                console.log("claim victory");

                self.gameHubSender.claimVictory();
            });
    }
}