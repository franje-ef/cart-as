class GameControls {
    constructor(game, isMasterUser) {
        this.game = game;
        this.isMasterUser = isMasterUser;
    }

    init() {
        const loader = new PIXI.Loader();

        loader.add('exit', '/Content/img/game/exit.svg');
        loader.add('shuffle', '/Content/img/game/shuffle.svg');
        loader.add('victory', '/Content/img/game/victory.svg');
        loader.add('start', '/Content/img/game/start.svg');
        loader.load((_, resources) => this._onAssetsLoaded(resources, this));
    }

    _onAssetsLoaded(resources, self) {
        var container = new PIXI.Container();
        container.x = self.game.width - 120;

        self._createButton(resources, container, "exit", () => self._onExitPressed());
        self._createButton(resources, container, "shuffle", () => null);
        self._createButton(resources, container, "victory", () => null);
        if (self.isMasterUser) {
            self._createButton(resources, container, "start", () => null);    
        }
        

        self.game.stage.addChild(container);
    }

    _createButton(resources, container, resourceId, func) {
        var button = new PIXI.Sprite(resources[resourceId].texture);
        button.height = 90;
        button.width = 90;
        button.y = container.height;
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

            func();
        }

        container.addChild(button);
    }

    _onExitPressed() {
        window.location.href = "/";
    }
}