class Romi {
    init(game) {
        var container = new PIXI.Container();

        document.fonts.load('8pt "Cabin Sketch"').then(() => {
            let text = new PIXI.Text("2 tríos y 1 seguidilla",
                {
                    fontFamily: 'Cabin Sketch',
                    fontSize: 42,
                    fill: 0xffffff,
                    fontWeight: "500",
                    lineHeight: 4
                });
            game.stage.addChild(text);
        });
    }
}