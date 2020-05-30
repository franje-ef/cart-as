class Board {
    private gameId: string;
    table: PIXI.Sprite;
    tableFrame: PIXI.Sprite;

    constructor(gameId: string) {
        this.gameId = gameId;
    }
    

    init(parent: PIXI.Application) {
        var tableInitHeight = 428;
        var tableInitWidth = 820;
        var tableScale = 1.5;

        var tableSvg = '/Content/img/game/table_background_green.svg';
        var tableTexture = PIXI.Texture.from(tableSvg, { resourceOptions: { scale: tableScale } });
        const table = new PIXI.Sprite(tableTexture);
        table.height = tableInitHeight * tableScale;
        table.width = tableInitWidth * tableScale;
        table.position.x = parent.view.width / 2 - table.width / 2;
        table.position.y = (parent.view.height / 2 - table.height / 2) / 2;
        this.table = table;

        parent.stage.addChild(table);

        var tableFrameSvg = '/Content/img/game/table_frame.svg';
        var tableFrameTexture = PIXI.Texture.from(tableFrameSvg, { resourceOptions: { scale: tableScale } });
        const tableFrame = new PIXI.Sprite(tableFrameTexture);
        tableFrame.height = tableInitHeight * tableScale;
        tableFrame.width = tableInitWidth * tableScale;
        tableFrame.position.x = parent.view.width / 2 - tableFrame.width / 2;
        tableFrame.position.y = (parent.view.height / 2 - tableFrame.height / 2) / 2;
        this.tableFrame = tableFrame;

        parent.stage.addChild(tableFrame);

        this.addPlayedCardPlaceHolder(table);
        this.addLogo(parent.stage);
        this.addGameId(parent.stage);
    }

    hide() {
        this.table.visible = false;
        this.tableFrame.visible = false;

    }

    show() {
        this.table.visible = true;
        this.tableFrame.visible = true;
    }

    private addPlayedCardPlaceHolder(parent) {
        const playedCardPlaceHolder = new PIXI.Graphics();
        playedCardPlaceHolder.lineStyle(2, 0x5b9e34, 1);
        playedCardPlaceHolder.beginFill(0x650A5A, 0.15);
        playedCardPlaceHolder.drawRoundedRect(800, 200, 160, 230, 16);
        playedCardPlaceHolder.endFill();
        

        parent.addChild(playedCardPlaceHolder);
    }

    private addLogo(parent) {
        const logo = PIXI.Sprite.from("/Content/img/logo.PNG");
        logo.scale.x = 0.4;
        logo.scale.y = 0.4;

        console.log(logo.width);

        parent.addChild(logo);
    }

    private addGameId(parent: PIXI.Container) {
        let gameIdText = new PIXI.Text(this.gameId,
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 42,
                fill: 0xffffff,
                fontWeight: "500",
                lineHeight: 4
            });

        gameIdText.y = 150;
        gameIdText.x = 240 / 2 - gameIdText.width / 2;

        parent.addChild(gameIdText);
    }
}