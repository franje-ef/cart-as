class PlayerDeck {
    game: Game;
    width: number;
    cards;
    resources;
    gameHubSender: GameHubSender;
    container: PIXI.Container;
    graphics: PIXI.Graphics;

    constructor(game: Game, cards, resources, gameHubSender: GameHubSender) {
        this.game = game;
        this.width = 1670;
        this.cards = cards;
        this.resources = resources;
        this.gameHubSender = gameHubSender;
    }

    init() {
        var container = new PIXI.Container();
        container.x = 150;
        container.y = 800;
        this.container = container;

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x5b9e34, 1);
        graphics.beginFill(0x650A5A, 0.15);
        graphics.drawRoundedRect(0, 0, 1670, 250, 16);
        graphics.endFill();
        graphics.height = 250;
        graphics.width = this.width;
        this.graphics = graphics;

        container.addChild(graphics);
        this.initCards(this.cards);

        this.game.app.stage.addChild(container);
    }

    private initCards(cards) {
        //cards are 150 width
        var nextX = 80;

        var sepparation = (this.width - nextX - (150 * cards.length)) / cards.length;

        for (var i = 0; i < cards.length; i++) {
            this.addCardToPlayer(cards[i].num, cards[i].suit, nextX);
            nextX += 150 + sepparation;
        }
    }

    getSnapshotBase64() {
        return this.game.app.renderer.plugins.extract.base64(this.container);
    }

    addCardToPlayer(num, suit, x) {
        var card = new CardSprite(this.resources[num + "_" + suit].texture);
        card.scale.x = 0.30;
        card.scale.y = 0.30;

        card.x = card.initialX = x;
        card.y = card.initialY = 120;
        card.num = num;
        card.suit = suit;
        card.interactive = true;
        card.buttonMode = true;
        card.anchor.set(0.5);
        this.adjustCardX(card);

        card.on('pointerdown', event => this.onPlayerCardDragStart(event));
        card.on('pointerup', event => {this.onPlayerCardDragEnd(event, this);});
        card.on('pointerupoutside', event => {this.onPlayerCardDragEnd(event, this);});
        card.on('pointermove', event => this.onPlayerCardDragMove(event));

        this.graphics.addChild(card);
    }

    onPlayerCardDragStart(event) {
        //console.log(event.data.global.x);
        var card = event.currentTarget;
        card.alpha = 0.5;
        card.dragging = true;
        card.initialX = card.x;
        card.initialY = card.y;

        card.zIndex = Math.max.apply(Math, card.parent.children.map(card => card.zIndex)) + 1;
        card.parent.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }

    onPlayerCardDragEnd(event, self: PlayerDeck) {
        var card = event.currentTarget;

        card.alpha = 1;
        card.dragging = false;
        card.data = null;

        if (card.x > 1030 && card.x < 1130 && card.y < -340 && card.y > -460) {
            self.gameHubSender.playCard(card.num, card.suit).done(function (result) {
                if (result) {
                    card.parent.removeChild(card);
                } else {
                    card.x = card.initialX;
                    card.y = card.initialY;
                }
            });

            return;
        }

        self.adjustCardX(card);
        
        if (card.y < 110) {
            card.y = 110;
        } else if (card.y > 140) {
            card.y = 140;
        }
    }

    onPlayerCardDragMove(event) {
        var card = event.currentTarget;

        if (card.dragging) {
            const newPosition = event.data.getLocalPosition(card.parent);
            card.x = newPosition.x;
            card.y = newPosition.y;

            //console.log("X = " + newPosition.x);
            //console.log("Y = " + newPosition.y);
        }
    }

    private adjustCardX(card) {
        if (card.x < 75) {
            card.x = 75;
        } else if (card.x > 1590) {
            card.x = 1590;
        }
    }

    
}