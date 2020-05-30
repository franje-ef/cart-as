
class GameControls {
    private isPlaying: boolean;
    isGameStarted: boolean;
    game: Game;
    isMasterUser: boolean;
    resources: any;
    playerDeck: any;
    gameHubSender: GameHubSender;
    isGameFinished: boolean;

    constructor(game : Game, isMasterUser: boolean, resources: any, gameHubSender: GameHubSender, playerDeck: any, isGameFinished: boolean, isGameStarted: boolean, isPlaying: boolean) {
        this.isPlaying = isPlaying;
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.resources = resources;
        this.gameHubSender = gameHubSender;
        this.playerDeck = playerDeck;
        this.isGameFinished = isGameFinished;
        this.isGameStarted = isGameStarted;
    }

    init() {
        var container = new PIXI.Container();
        container.x = this.game.width - 120;

        this.createButton(this.resources, container, "exit", () => this.onExitPressed());

        if (!this.isGameFinished && this.isGameStarted && this.isPlaying) {
            this.createButton(this.resources, container, "shuffle", () => this.onShufflePressed());
            this.createButton(this.resources, container, "victory", () => this.onVictoryPressed());
        }
        
        if (this.isMasterUser) {
            this.createButton(this.resources, container, "start", () => this.onStartPressed());
        }


        this.game.stage.addChild(container);
    }

    private createButton(resources, container, resourceId, func) {
        var button = new PIXI.Sprite(resources[resourceId].texture);
        button.height = 90;
        button.width = 90;
        button.y = container.height;
        button.interactive = true;
        button.buttonMode = true;
        button.on("mousedown", event => this.buttonClicked(event, func));
        button.on("touchstart", event => this.buttonClicked(event, func));

        container.addChild(button);
    }

    private buttonClicked(event, func) {
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

    private onExitPressed() {
        window.location.href = "/";
    }

    private onShufflePressed() {
        location.reload();
    }

    private onStartPressed() {
        this.gameHubSender.startGame();
    }

    private onVictoryPressed() {
        const snapshot = this.playerDeck.getSnapshotBase64();
        $.post("/game/snapshot",
                {
                    gameId: this.game.gameId,
                    base64: snapshot
                })
            .done(data => {
                console.log("claim victory");

                this.gameHubSender.claimVictory();
            });
    }
}