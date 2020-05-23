class ResourceLoader {
    constructor() {
        this.loader = new PIXI.Loader();
    }

    init(onCompleteFunc) {
        this._loadCardImages(this.loader);
        this._loadReactions(this.loader);
        this._loadRomi(this.loader);
        this._loadGameControls(this.loader);

        this.loader.load((_, resources) => this._onCompleteLoaderLoading(this, resources, onCompleteFunc));
    }

    _loadGameControls(loader) {
        loader.add('exit', '/Content/img/game/exit.svg');
        loader.add('shuffle', '/Content/img/game/shuffle.svg');
        loader.add('victory', '/Content/img/game/victory.svg');
        loader.add('start', '/Content/img/game/start.svg');
    }

    _loadRomi(loader) {
        loader.add('target', '/Content/img/target.svg');
        loader.add('bow', '/Content/img/bow.svg');
    }

    _loadReactions(loader) {
        loader.add('like', '/Content/img/icons/like.svg');
        loader.add('dislike', '/Content/img/icons/dislike.svg');
        loader.add('heart', '/Content/img/icons/heart.svg');
        loader.add('middle', '/Content/img/icons/middle.svg');
        loader.add('poo', '/Content/img/icons/poo.svg');
        loader.add('super', '/Content/img/icons/super.svg');
        loader.add('yawning', '/Content/img/icons/yawning.svg');
        loader.add('bubble', '/Content/img/bubble.svg');
    }

    _loadCardImages(loader) {
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

    _onCompleteLoaderLoading(self, resources, onCompleteFunc) {
        self.resources = resources;

        document.fonts.load('8pt "Cabin Sketch"').then(() => self._onCompleteAllLoading(self, onCompleteFunc));
    }

    _onCompleteAllLoading(self, onCompleteFunc) {
        onCompleteFunc();
    }
}
    