class ResourceLoader {
    private loader: PIXI.Loader;
    private document;

    constructor(document: any) {
        this.loader = new PIXI.Loader();
        this.document = document;
    }

    init(onCompleteFunc) {
        this.loadCardImages(this.loader);
        this.loadReactions(this.loader);
        this.loadRomi(this.loader);
        this.loadGameControls(this.loader);
        this.loadWinnerResources(this.loader);

        this.loader.load((_, resources) => this.onCompleteLoaderLoading(this, resources, onCompleteFunc));
    }

    private loadTableImages(loader: PIXI.Loader) {
        loader.add('table', '/Content/img/game/table_background_green.svg' );
        loader.add('tableFrame', '/Content/img/game/table_frame.svg');
    }

    private loadWinnerResources(loader) {
        loader.add('logo', '/Content/img/logo.PNG');
        loader.add('frame', '/Content/img/game/frame.png');
        loader.add('glasses', '/Content/img/game/glasses.png');
        loader.add('crown', '/Content/img/game/crown.png');
        loader.add('winnerSong', '/Content/winnerSong.mp3');
    }

    private loadGameControls(loader) {
        loader.add('exit', '/Content/img/game/exit.svg');
        loader.add('shuffle', '/Content/img/game/shuffle.svg');
        loader.add('victory', '/Content/img/game/victory.svg');
        loader.add('start', '/Content/img/game/start.svg');
    }

    private loadRomi(loader) {
        loader.add('target', '/Content/img/target.svg');
        loader.add('bow', '/Content/img/bow.svg');
    }

    private loadReactions(loader) {
        loader.add('like', '/Content/img/icons/like.svg');
        loader.add('dislike', '/Content/img/icons/dislike.svg');
        loader.add('heart', '/Content/img/icons/heart.svg');
        loader.add('middle', '/Content/img/icons/middle.svg');
        loader.add('poo', '/Content/img/icons/poo.svg');
        loader.add('super', '/Content/img/icons/super.svg');
        loader.add('yawning', '/Content/img/icons/yawning.svg');
        loader.add('bubble', '/Content/img/bubble.svg');
    }

    private loadCardImages(loader) {
        for (var suit = 1; suit < 5; suit++) {
            for (var num = 1; num < 14; num++) {
                loader.add(num + "_" + suit, '/Content/img/cards/standard/' + num + "_" + suit + ".png");
            }
        }

        //jokers
        loader.add('1_0', '/Content/img/cards/standard/1_0.png');
        loader.add('2_0', '/Content/img/cards/standard/2_0.png');

        loader.add('reverse', '/Content/img/cards/standard/reverse.png');
    }

    private onCompleteLoaderLoading(self, resources, onCompleteFunc) {
        self.resources = resources;

        this.document.fonts.load('8pt "Cabin Sketch"').then(() => self.onCompleteAllLoading(self, onCompleteFunc));
    }

    private onCompleteAllLoading(self, onCompleteFunc) {
        onCompleteFunc();
    }
}
    