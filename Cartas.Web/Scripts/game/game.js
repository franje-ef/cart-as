class Game {
    constructor(gameId) {
        this.gameId = gameId;
    }

    init() {
        var size = [1920, 1080];
        this.width = size[0];
        
        const app = new PIXI.Application({
            height: size[1],
            width: size[0],
            transparent: true
        });

        this.app = app;

        const ratio = size[0] / size[1];
        //this.renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
        document.body.appendChild(app.view);

        const game = this;
        window.addEventListener('resize', function() { game._resize(app, ratio); });
        window.onorientationchange = function() { game._resize(app, ratio); }
        
        this.stage = app.stage;
        
        this._resize(app, ratio);
    }

    _resize(app, ratio) {
        if (document.body.clientWidth / document.body.clientHeight >= ratio) {
            var w = document.body.clientHeight * ratio;
            var h = document.body.clientHeight;
        } else {
            var w = document.body.clientWidth;
            var h = document.body.clientWidth / ratio;
        }

        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    }
}