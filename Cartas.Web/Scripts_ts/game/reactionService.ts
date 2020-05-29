class Seat {
    x: number;
    y: number;
    seat: number;
}

class Bubble extends PIXI.Sprite {
    seat: number;
    hideAt: number;
}

class ReactionService {
    game: Game;
    seats: Array<any>;
    bubbles: Array<Bubble>;
    resources;
    gameHubSender: GameHubSender;

    constructor(game : Game, resources, gameHubSender: GameHubSender) {
        this.game = game;
        this.seats =
            [{ x: 680, y: 600, seat: 1 }, { x: 980, y: 600, seat: 2 }, { x: 1280, y: 600, seat: 3 }
            , { x: 1580, y: 200, seat: 5 }, { x: 1580, y: 400, seat: 4 }
            , { x: 1280, y: 20, seat: 6 }, { x: 980, y: 20, seat: 7 }, { x: 680, y: 20, seat: 8 }
            , { x: 430, y: 400, seat: 10 }, { x: 430, y: 200, seat: 9 }
            ];


        this.bubbles = [];
        this.resources = resources;
        this.gameHubSender = gameHubSender;
    }

    init() {
        this.setUpReaction(this, 25, 800, "like");
        this.setUpReaction(this, 25, 864, "heart");
        this.setUpReaction(this, 25, 928, "super");
        this.setUpReaction(this, 75, 800, "dislike");
        this.setUpReaction(this, 75, 864, "poo");
        this.setUpReaction(this, 75, 928, "middle");
        this.setUpReaction(this, 50, 992, "yawning");

        this.setUpBubbles(this, this.resources);
    }

    onReactionSent(seat, reactionId) {
        var bubble = this.bubbles.find(x=> x.seat === seat);
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

    private setUpReaction(self: ReactionService, x, y, reactionId) {
        var reaction = new PIXI.Sprite(self.resources[reactionId].texture);
        reaction.height = 64;
        reaction.width = 64;
        reaction.x = x;
        reaction.y = y;
        reaction.interactive = true;
        reaction.buttonMode = true;

        reaction.on("mousedown",
            (event) => {
                self.reactionClicked(event, self, reactionId);
            });

        reaction.on("touchstart",
            (event) => {
                self.reactionClicked(event, self, reactionId);
            });

        self.game.stage.addChild(reaction);
    }

    private reactionClicked(event, self, reactionId) {
        var button = event.target;
        var original = button.height;

        button.height = original * 2;
        button.width = original * 2;

        TweenLite.to(button, 0.4, {
            height: original,
            width: original,
            ease: Elastic.easeOut
        });

        self.gameHubSender.sendReaction(reactionId);
    }

    private setUpBubbles(self, resources) {
        for (var i = 0; i < self.seats.length; i++) {
            var bubble = new Bubble(resources.bubble.texture);
            bubble.x = self.seats[i].x;
            bubble.y = self.seats[i].y;
            bubble.seat = self.seats[i].seat;
            bubble.height = 150;
            bubble.width = 150;
            bubble.visible = false;


            self.game.stage.addChild(bubble);
            self.bubbles.push(bubble);
        }
    }
}