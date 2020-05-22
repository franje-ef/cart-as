class Board {
    init(parent) {
        var tableInitHeight = 428;
        var tableInitWidth = 820;
        var tableScale = 1.5;

        var tableSvg = '/Content/img/game/table_background_green.svg';
        var tableTexture = new PIXI.Texture.from(tableSvg, { resourceOptions: { scale: tableScale } });
        const table = new PIXI.Sprite(tableTexture);
        table.height = tableInitHeight * tableScale;
        table.width = tableInitWidth * tableScale;
        table.position.x = parent.view.width / 2 - table.width / 2;
        table.position.y = (parent.view.height / 2 - table.height / 2) / 2;
        this.table = table;

        parent.stage.addChild(table);

        var tableFrameSvg = '/Content/img/game/table_frame.svg';
        var tableFrameTexture = new PIXI.Texture.from(tableFrameSvg, { resourceOptions: { scale: tableScale } });
        const tableFrame = new PIXI.Sprite(tableFrameTexture);
        tableFrame.height = tableInitHeight * tableScale;
        tableFrame.width = tableInitWidth * tableScale;
        tableFrame.position.x = parent.view.width / 2 - tableFrame.width / 2;
        tableFrame.position.y = (parent.view.height / 2 - tableFrame.height / 2) / 2;
        this.tableFrame = tableFrame;

        parent.stage.addChild(tableFrame);

        this._addPlayedCardPlaceHolder(table);
        this._addLogo(parent.stage);
    }

    hide() {
        this.table.visible = false;
        
    }

    show() {
        this.table.visible = true;
    }

    _addPlayedCardPlaceHolder(parent) {
        const playedCardPlaceHolder = new PIXI.Graphics();
        playedCardPlaceHolder.lineStyle(2, 0x5b9e34, 1);
        playedCardPlaceHolder.beginFill(0x650A5A, 0.15);
        playedCardPlaceHolder.drawRoundedRect(800, 200, 160, 230, 16);
        playedCardPlaceHolder.endFill();
        playedCardPlaceHolder.update = function () {

        }

        parent.addChild(playedCardPlaceHolder);
    }

    _addLogo(parent) {
        const logo = PIXI.Sprite.from("/Content/img/logo.PNG");
        logo.scale.x = 0.4;
        logo.scale.y = 0.4;

        parent.addChild(logo);
    }
}