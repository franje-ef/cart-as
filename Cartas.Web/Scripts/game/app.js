class Game {
    constructor() {
        
    }

    init() {
        var size = [1920, 1080];

        const app = new PIXI.Application({
            height: size[1],
            width: size[0],
            transparent: true
        });

        const ratio = size[0] / size[1];
        //this.renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
        document.body.appendChild(app.view);

        const game = this;
        window.addEventListener('resize', function() { game._resize(app, ratio); });
        window.onorientationchange = function() { game._resize(app, ratio); }

        this.board = new Board().init(app);
        this.playerDeck = new PlayerDeck().init(app.stage);
        /**
         * DEMO
         */
        Players.addPlayer("Jesús", '/Content/img/avatars/038-athlete.png', app.stage);
        Players.addPlayer("Adri", '/Content/img/avatars/005-girl-7.png', app.stage);
        Players.addPlayer("3", '/Content/img/avatars/016-boy-14.png', app.stage);
        Players.addPlayer("4", '/Content/img/avatars/026-boy-9.png', app.stage);
        Players.addPlayer("5", '/Content/img/avatars/006-bald.png', app.stage);
        Players.addPlayer("6", '/Content/img/avatars/007-athlete-1.png', app.stage);
        Players.addPlayer("7", '/Content/img/avatars/036-viking.png', app.stage);
        Players.addPlayer("8", '/Content/img/avatars/042-sheriff.png', app.stage);
        Players.addPlayer("9", '/Content/img/avatars/044-futuristic.png', app.stage);
        Players.addPlayer("10", '/Content/img/avatars/005-girl-7.png', app.stage);
        /**
         *END DEMO
         */


        this._resize(app, ratio);
    }

    _resize(app, ratio) {
        if (window.visualViewport.width / window.visualViewport.height >= ratio) {
            var w = window.visualViewport.height * ratio;
            var h = window.visualViewport.height;
        } else {
            var w = window.visualViewport.width;
            var h = window.visualViewport.width / ratio;
        }
        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    }
}