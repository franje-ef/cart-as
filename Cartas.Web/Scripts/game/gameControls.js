class GameControls {
    constructor(game, isMasterUser, resources) {
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.resources = resources;
    }

    init() {
        var container = new PIXI.Container();
        container.x = this.game.width - 120;

        this._createButton(this.resources, container, "exit", () => this._onExitPressed());
        this._createButton(this.resources, container, "shuffle", () => this._onShufflePressed());
        this._createButton(this.resources, container, "victory", () => null);
        if (this.isMasterUser) {
            this._createButton(this.resources, container, "start", () => null);
        }


        this.game.stage.addChild(container);
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

    _onShufflePressed() {
        location.reload();
    }
}