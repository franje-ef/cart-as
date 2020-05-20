class ReactionService {
    constructor(game) {
        this.game = game;
    }

    init() {
        this.game.app.loader.add('like', '/Content/img/icons/like.svg');
        this.game.app.loader.add('dislike', '/Content/img/icons/dislike.svg');

        this.game.app.loader.load((loader, resources) => this.onAssetsLoaded(resources, this.game));
    }

    onAssetsLoaded(resources, game) {
        var likeButton = new PIXI.Sprite(resources.like.texture);
        likeButton.height = 64;
        likeButton.width = 64;
        likeButton.x = 25;
        likeButton.y = 800;
        likeButton.interactive = true;
        likeButton.buttonMode = true;
        //likeButton.defaultCursor = "crosshair";

        const onButtonPressed = this.onButtonPressed;
        likeButton.mousedown = likeButton.touchstart = function (event) {
            //event.originalEvent.preventDefault();
            onButtonPressed(event);
        }

        game.stage.addChild(likeButton);

        var dislikeButton = new PIXI.Sprite(resources.dislike.texture);
        dislikeButton.height = 64;
        dislikeButton.width = 64;
        dislikeButton.x = 25;
        dislikeButton.y = 864;

        game.stage.addChild(dislikeButton);
    }

    onButtonPressed(event) {
        console.log("pressed");
        var button = event.target;
        var original = button.height;

        button.height = original * 2;
        button.width = original * 2;

        TweenLite.to(button, 0.2, {
            height: original,
            width: original,
            ease: Elastic.easeOut
        });
    }
}