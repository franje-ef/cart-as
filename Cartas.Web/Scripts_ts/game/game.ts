class Game {
    private window;
    private document;
    width: number;
    gameId: string;
    app: PIXI.Application;
    stage: PIXI.Container;


    constructor(gameId: string, document: any, window: any) {
        this.window = window;
        this.document = document;
        this.gameId = gameId;
    }

    init() {
        var size = [1920, 1080];
        this.width = size[0];

        var options = 
        {
            height: size[1],
            width: size[0],
            transparent: true
        };
        const app = new PIXI.Application(options);
        
        this.app = app;

        const ratio = size[0] / size[1];
        this.document.body.appendChild(app.view);

        this.window.addEventListener('resize', () => { this.resize(this.document, app, ratio); });
        this.window.onorientationchange = () => { this.resize(this.document, app, ratio); }

        this.stage = app.stage;

        this.resize(this.document, app, ratio);
    }

    private resize(document, app, ratio) {
        let w: number;
        let h: number;

        if (document.body.clientWidth / document.body.clientHeight >= ratio) {
            w = document.body.clientHeight * ratio;
            h = document.body.clientHeight;
        } else {
            w = document.body.clientWidth;
            h = document.body.clientWidth / ratio;
        }

        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    }

}