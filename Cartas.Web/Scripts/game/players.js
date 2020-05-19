class Players {
    static playerPositions = [{ x: 600, y: 600 }, { x: 900, y: 600 }, { x: 1200, y: 600 }
        , { x: 350, y: 400 }, { x: 1500, y: 400 }
        , { x: 350, y: 200 }, { x: 1500, y: 200 }
        , { x: 600, y: 20 }, { x: 900, y: 20 }, { x: 1200, y: 20 }
    ];
    static playerPositionsIndex = 0;

    static addPlayer(playerName, avatarUrl, parent) {
        var playerContainer = new PIXI.Container();

        const playerNameBox = new PIXI.Graphics();
        playerNameBox.lineStyle(2, 0x5b9e34, 1);
        playerNameBox.beginFill(0xffffff, 1);
        playerNameBox.drawRoundedRect(0, 110, 100, 50, 16);
        playerNameBox.endFill();
        playerNameBox.update = function () {

        }

        const a = PIXI.Sprite.from(avatarUrl);
        a.height = 100;
        a.width = 100;
        a.x = 0;
        a.y = 0;

        let basicText = new PIXI.Text(playerName,
            { fontFamily: 'Arial', fontSize: 20, fill: 0xff1010, align: 'center' });

        basicText.x = 1;
        basicText.y = 110;

        playerContainer.addChild(playerNameBox);
        playerContainer.addChild(a);
        playerContainer.addChild(basicText);
        playerContainer.x = this.playerPositions[this.playerPositionsIndex].x;
        playerContainer.y = this.playerPositions[this.playerPositionsIndex].y;
        this.playerPositionsIndex++;

        playerNameBox.addChild(basicText);

        parent.addChild(playerContainer);
    }
}