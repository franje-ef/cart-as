class PlayerContainer extends PIXI.Container{
    playerId: string
}

class Players {
    resources: any;
    game: Game;
    isMasterUser: boolean;
    tweens: Array<any>;
    players: Array<PlayerContainer>;
    gameHubSender: GameHubSender;
    thisPlayerId: string;

    constructor(game: Game, isMasterUser: boolean, gameHubSender: GameHubSender, thisPlayerId: string, resources: any) {
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.tweens = [];
        this.players = [];
        this.gameHubSender = gameHubSender;
        this.thisPlayerId = thisPlayerId;
        this.resources = resources;
    }

    playerPositions = [{ x: 600, y: 600, seat: 1}, { x: 900, y: 600, seat: 2 }, { x: 1200, y: 600, seat: 3}
        , { x: 350, y: 400, seat: 10 }, { x: 1500, y: 400, seat: 4 }
        , { x: 350, y: 200, seat: 9 }, { x: 1500, y: 200, seat: 5 }
        , { x: 600, y: 20, seat: 8 }, { x: 900, y: 20, seat: 7 }, { x: 1200, y: 20, seat: 6 }
    ];

    addPlayer(playerId, playerName, avatarId, seat, winCount) { 
        if (this.players.filter(x => x.playerId == playerId).length > 0)  
            return;
        
        var player = new PlayerContainer();

        this.addAvatar(player, avatarId, seat);
        this.addPlayerName(player, playerName);
        if (this.isMasterUser && this.thisPlayerId !== playerId) {
            this.addDeleteButton(player, seat);    
        }

        if (winCount > 0) {
            this.addVictories(player, winCount);    
        }

        var playerPosition = this.playerPositions.find(x => x.seat === seat);
        player.x = playerPosition.x;
        player.y = playerPosition.y;
        player.playerId = playerId;
        
        this.game.stage.addChild(player);
        this.players.push(player);
    }

    setCurrentTurn(seat) {
        var activeTweens = this.tweens.filter(x => x.isActive());
        for (var i = 0; i < activeTweens.length; i++) {
            activeTweens[i].pause(0);
        }

        var tween = this.tweens.find(x => x.seat === seat);
        tween.resume();
    }

    onPlayerRemoved(seat, removedPlayerId) {
        if (removedPlayerId === this.thisPlayerId) {
            window.location.href = "/";
        }

        var index = this.players.map(x => x.playerId).indexOf(removedPlayerId);
        var player = this.players[index];
        this.players.splice(index, 1);

        this.game.stage.removeChild(player);
    }

    addAvatar(container, avatarId, seat) {
        const avatar = PIXI.Sprite.from(this.resources[avatarId].texture);
        avatar.height = 100;
        avatar.width = 100;
        avatar.x = 0;
        avatar.y = 0;

        var tween:any = gsap.fromTo(avatar, { alpha: 1 }, { duration: 1, alpha: 0, yoyo: true, repeat: -1, paused: true });
        tween.seat = seat;
        this.tweens.push(tween);

        container.addChild(avatar);
    }

    addPlayerName(container, playerName) {
        const playerNameBox = new PIXI.Graphics();
        playerNameBox.lineStyle(2, 0x5b9e34, 1);
        playerNameBox.beginFill(0xffffff, 1);
        playerNameBox.drawRoundedRect(-20, 110, 140, 55, 16);
        playerNameBox.endFill();
        container.addChild(playerNameBox);

        let name = new PIXI.Text(playerName,
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 25,
                fill: 0x000000,
                fontWeight: "600",
                //lineHeight: 4,
                breakWords: true,
                wordWrap: true,
                wordWrapWidth: playerNameBox.width - 7
            });

        name.x = (playerNameBox.width - name.width) / 2 - 20;
        name.y = name.height > 30 ? 110 : 120;

        playerNameBox.addChild(name);
    }

    addDeleteButton(container, seat) {
        const button = PIXI.Sprite.from("/Content/img/game/trash.svg");
        button.height = 48;
        button.width = 48;
        button.x = -30;
        button.y = 50;
        button.interactive = true;
        button.buttonMode = true;
        button.on("mousedown", event => this.onDeleteClicked(event, seat, this.gameHubSender));
        button.on("touchstart", event => this.onDeleteClicked(event, seat, this.gameHubSender));

        container.addChild(button);
    }

    private onDeleteClicked(event, seat, gameHubSender: GameHubSender) {
        var target = event.target;
        var original = target.height;

        target.height = original * 2;
        target.width = original * 2;

        TweenLite.to(target, 0.4, {
            height: original,
            width: original,
            ease: Elastic.easeOut
        });

        gameHubSender.removePlayer(seat);
    }

    addVictories(container, winCount) {
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