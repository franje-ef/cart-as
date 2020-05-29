class Winner {
    avatar: string;
    winCount: number;
    resources: any;
    game: Game;
    name: string;

    constructor(game: Game, resources, name: string, avatar: string, winCount: number) {
        this.game = game;
        this.name = name;
        this.avatar = avatar;
        this.winCount = winCount;
        this.resources = resources;
    }

    init() {
        var container = new PIXI.Container();

        this._addFrame(container);
        this._addLogo(this.game.app.stage);
        this._addAvatar(container, this.avatar);
        
        const crown = this._addCrown(container);
        const glasses = this._addGlasses(container);

        this._addWinnerName(this.name, this.game.app.stage, container.height - 100);
        this._addVictories(this.game.app.stage, this.winCount, container.height - 50);

        container.position.x = this.game.app.view.width / 2 - container.width / 2;

        this.game.app.stage.addChild(container);

        this.initAnimations(crown, glasses);

        this._addEffects(this.game.app.stage, (this.game.app.view.width / 2 - container.width), container.height - 150);
        this._addEffects(this.game.app.stage, (this.game.app.view.width / 2 + container.width), container.height - 150);

        this._playSong(this.resources);
    }

    private initAnimations(crown, glasses) {
        var tl = gsap.timeline();
        
        gsap
        tl.to(crown, { alpha: 1, duration: 2 })
            .to(glasses, { y: 315, duration: 5 }, "+=3");


    }

    private _addLogo(parent) {
        const logo = PIXI.Sprite.from(this.resources['logo'].texture);
        logo.scale.x = 0.4;
        logo.scale.y = 0.4;

        parent.addChild(logo);
    }

    private _addAvatar(container, avatarUrl) {
        const avatar = PIXI.Sprite.from(avatarUrl);
        avatar.height = 400;
        avatar.width = 400;
        //avatar.height = 100;
        //avatar.width = 100;
        avatar.x = container.width / 2 - avatar.width / 2;
        avatar.y = 250;

        //var tween = gsap.fromTo(avatar, { alpha: 1 }, { duration: 1, alpha: 0, yoyo: true, repeat: -1, paused: true });
        //tween.seat = seat;
        //this.tweens.push(tween);

        container.addChild(avatar);
    }

    private _addWinnerName(playerName, container, y) {
        var winner = new PIXI.Text("¡" + playerName + " ha ganado esta partida!",
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 42,
                fill: 0xffffff,
                fontWeight: "500",
                lineHeight: 4
            });
        winner.x = this.game.app.view.width / 2 - winner.width / 2;
        winner.y = y;

        container.addChild(winner);
    }

    private _addVictories(container, winCount, y) {
        
        //winIcon.height = 48;
        //winIcon.width = 48;
        //winIcon.x = -30;
        var victoryContainer = new PIXI.Container();

        var x = 0;

        for (var i = 0; i < winCount; i++) {
            const winIcon = PIXI.Sprite.from(this.resources['victory'].texture);
            winIcon.x = x;

            victoryContainer.addChild(winIcon);
            x += winIcon.width;
        }

        victoryContainer.x = this.game.app.view.width / 2 - victoryContainer.width / 2;
        victoryContainer.y = y;

        container.addChild(victoryContainer);
    }

    private _addFrame(container) {
        const frame = PIXI.Sprite.from(this.resources['frame'].texture);
        
        container.addChild(frame);
    }

    private _addGlasses(container) {
        const glasses = PIXI.Sprite.from(this.resources['glasses'].texture);
        glasses.y = -100;
        glasses.x = 25;
        //glasses.alpha = 0;

        container.addChild(glasses);

        return glasses;
    }

    private _addCrown(container) {
        const crown = PIXI.Sprite.from(this.resources['crown'].texture);
        crown.height = 200;
        crown.width = 200;
        crown.x = container.width / 2 - crown.width / 2;
        crown.y = 100;
        crown.alpha = 0;

        container.addChild(crown);

        return crown;
    }

    private _playSong(resources) {
        resources.winnerSong.sound.play();
        //const sound = PIXI.sound.Sound.from('Content/winnerSong.mp3');
        //sound.play();
    }

    private _addEffects(container, x, y) {
        var emitter = new PIXI.particles.Emitter(
            container,[PIXI.Texture.from('/Content/img/Sparks.PNG')],
            {
                "alpha": {
                    "start": 1,
                    "end": 0.31
                },
                "scale": {
                    "start": 0.5,
                    "end": 1
                },
                "color": {
                    "start": "ffffff",
                    "end": "9ff3ff"
                },
                "speed": {
                    "start": 1000,
                    "end": 200
                },
                "startRotation": {
                    "min": 225,
                    "max": 320
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 20
                },
                "lifetime": {
                    "min": 0.25,
                    "max": 0.5
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": 0,
                "maxParticles": 1000,
                "pos": {
                    "x": x,
                    "y": y
                },
                "addAtBack": false,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 0
                }
            });

        var elapsed = Date.now();

        var update = function () {
            requestAnimationFrame(update);
            var now = Date.now();

            emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };

        emitter.emit = true;

        update();
    }

    
}