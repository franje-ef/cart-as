class PlayerDeck {
    constructor(game) {
        this.game = game;
        this.width = 1670;
    }

    init() {
        var container = new PIXI.Container();
        container.x = 150;
        container.y = 800;
        this.container = container;

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x5b9e34, 1);
        graphics.beginFill(0x650A5A, 0.15);
        graphics.drawRoundedRect(0, 0, 1670, 250, 16);
        graphics.endFill();
        graphics.height = 250;
        graphics.width = this.width;
        graphics.update = function() {

        }

        const winIcon = new PIXI.Sprite.from("/Content/img/bow.svg");
        winIcon.height = 48;
        winIcon.width = 48;

        container.addChild(graphics);
        graphics.addChild(winIcon);

        this.game.app.stage.addChild(container);
    }

    getSnapshotBase64() {
        return this.game.app.renderer.plugins.extract.base64(this.container);
    }
}