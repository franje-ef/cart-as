class ReactionService {
    constructor(game, resources) {
        this.game = game;
        this.seats =
            [{ x: 680, y: 600 }, { x: 980, y: 600 }, { x: 1280, y: 600 }
            , { x: 1580, y: 200 }, { x: 1580, y: 400 }
            , { x: 1280, y: 20 }, { x: 980, y: 20 }, { x: 680, y: 20 }
            , { x: 430, y: 400 }, { x: 430, y: 200 }
        ];
        this.bubbles = [];
        this.resources = resources;
    }

    init() {
        this._setUpReaction(this, 25, 800, "like");
        this._setUpReaction(this, 25, 864, "heart");
        this._setUpReaction(this, 25, 928, "super");
        this._setUpReaction(this, 75, 800, "dislike");
        this._setUpReaction(this, 75, 864, "poo");
        this._setUpReaction(this, 75, 928, "middle");
        this._setUpReaction(this, 50, 992, "yawning");

        this._setUpBubbles(this, this.resources);

        /**
         * /TESTS
         */

        const self = this;

        function timeout() {
            setTimeout(function () {
                var randomNumber = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
                var randomReaction = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
                var reactions = ["dislike", "heart", "like", "middle", "poo", "super", "yawning"];
                self.onReactionReceived(randomNumber, reactions[randomReaction]);

                timeout();
            }, 1000);
        }

        timeout();
        /*END TESTS*/
    }

    onReactionReceived(seat, reactionId) {
        var bubble = this.bubbles[seat];
        bubble.removeChildren();
        bubble.visible = true;
        bubble.hideAt = Date.now() + 1500;

        var original = bubble.height;

        bubble.height = 0;
        bubble.width = 0;

        TweenLite.to(bubble, 1, {
            height: original,
            width: original,
            ease: Elastic.easeOut
        });

        var reaction = new PIXI.Sprite(this.resources[reactionId].texture);
        reaction.height = 64;
        reaction.width = 64;
        reaction.x = 45;
        reaction.y = 40;
        bubble.addChild(reaction);

        setTimeout(function () {
            if (Date.now() > bubble.hideAt) {
                bubble.visible = false;    
            }
        }, 1510);
    }

    _setUpReaction(self, x, y, reactionId) {
        var reaction = new PIXI.Sprite(self.resources[reactionId].texture);
        reaction.height = 64;
        reaction.width = 64;
        reaction.x = x;
        reaction.y = y;
        reaction.interactive = true;
        reaction.buttonMode = true;

        reaction.mousedown = reaction.touchstart = function (event) {
            var button = event.target;
            var original = button.height;

            button.height = original * 2;
            button.width = original * 2;

            TweenLite.to(button, 0.4, {
                height: original,
                width: original,
                ease: Elastic.easeOut
            });
        }

        self.game.stage.addChild(reaction);
    }

    _setUpBubbles(self, resources) {
        for (var i = 0; i < self.seats.length; i++) {
            var bubble = new PIXI.Sprite(resources.bubble.texture);
            bubble.x = self.seats[i].x;
            bubble.y = self.seats[i].y;
            bubble.height = 150;
            bubble.width = 150;
            bubble.visible = false;


            self.game.stage.addChild(bubble);
            self.bubbles.push(bubble);
        }
    }
}