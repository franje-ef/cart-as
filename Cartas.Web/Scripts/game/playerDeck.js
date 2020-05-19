class PlayerDeck {
    init(parent) {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x5b9e34, 1);
        graphics.beginFill(0x650A5A, 0.15);
        graphics.drawRoundedRect(100, 800, 1720, 250, 16);
        graphics.endFill();
        graphics.update = function() {

        }

        parent.addChild(graphics);
    }
}