class Players {
    constructor(game, isMasterUser) {
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.tweens = [];
        this.players = [];
    }

    playerPositions = [{ x: 600, y: 600, seat: 1}, { x: 900, y: 600, seat: 2 }, { x: 1200, y: 600, seat: 3}
        , { x: 350, y: 400, seat: 10 }, { x: 1500, y: 400, seat: 4 }
        , { x: 350, y: 200, seat: 9 }, { x: 1500, y: 200, seat: 5 }
        , { x: 600, y: 20, seat: 8 }, { x: 900, y: 20, seat: 7 }, { x: 1200, y: 20, seat: 6 }
    ];

    addPlayer(playerId, playerName, avatarUrl, seat, winCount) {
        if (this.players.includes(playerId))
            return;
        
        var container = new PIXI.Container();

        this._addAvatar(container, avatarUrl, seat);
        this._addPlayerName(container, playerName);
        if (this.isMasterUser) {
            this._addDeleteButton(container);    
        }

        if (winCount > 0) {
            this._addWinCount(container, winCount);    
        }

        var playerPosition = this.playerPositions.find(x => x.seat === seat);
        container.x = playerPosition.x;
        container.y = playerPosition.y;
        
        this.game.stage.addChild(container);
        this.players.push(playerId);
    }

    setCurrentTurn(seat) {
        var activeTweens = this.tweens.filter(x => x.isActive());
        for (var i = 0; i < activeTweens.length; i++) {
            activeTweens[i].pause(0);
        }

        var tween = this.tweens.find(x => x.seat === seat);
        tween.resume();
    }

    _addAvatar(container, avatarUrl, seat) {
        const avatar = PIXI.Sprite.from(avatarUrl);
        avatar.height = 100;
        avatar.width = 100;
        avatar.x = 0;
        avatar.y = 0;

        var tween = gsap.fromTo(avatar, { alpha: 1 }, { duration: 1, alpha: 0, yoyo: true, repeat: -1, paused: true });
        tween.seat = seat;
        this.tweens.push(tween);

        container.addChild(avatar);
    }

    _addPlayerName(container, playerName) {
        const playerNameBox = new PIXI.Graphics();
        playerNameBox.lineStyle(2, 0x5b9e34, 1);
        playerNameBox.beginFill(0xffffff, 1);
        playerNameBox.drawRoundedRect(-20, 110, 140, 55, 16);
        playerNameBox.endFill();
        playerNameBox.update = function () {

        }
        container.addChild(playerNameBox);

        document.fonts.load('8pt "Cabin Sketch"').then(() => this._onPlayerFontLoaded(playerNameBox, playerName));
    }

    _onPlayerFontLoaded(playerNameBox, playerName) {
        let name = new PIXI.Text(playerName,
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 25,
                fill: 0x000000,
                fontWeight: "600",
                //lineHeight: 4,
                breakWords: true,
                wordWrap: true,
                wordWrapWidth: playerNameBox.width - 2
            });

        name.x = (playerNameBox.width - name.width) / 2 - 22;

        name.y = name.height > 30 ? 110 : 120;

        

        playerNameBox.addChild(name);
    }

    _addDeleteButton(container) {
        const button = PIXI.Sprite.from("/Content/img/game/trash.svg");
        button.height = 48;
        button.width = 48;
        button.x = -30;
        button.y = 50;
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

            //TODO logic
        }

        container.addChild(button);
    }

    _addWinCount(container, winCount) {
        const winIcon = PIXI.Sprite.from("/Content/img/game/victory.svg");
        winIcon.height = 48;
        winIcon.width = 48;
        winIcon.x = -30;

        const counter = new PIXI.Text(winCount,
            { fontFamily: 'Arial', fontSize: 30, fill: 0xffffff, align: 'center' });
        counter.x = winCount > 9 ? -58 : -40;
        counter.y = 5;

        container.addChild(winIcon, counter);
    }
}