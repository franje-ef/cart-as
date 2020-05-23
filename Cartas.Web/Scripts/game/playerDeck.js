class PlayerDeck {
    constructor(game, cards, resources) {
        this.game = game;
        this.width = 1670;
        this.cards = cards;
        this.resources = resources;
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
        graphics.update = function() {

        }
        this.graphics = graphics;
        //graphics.sortableChildren = true;

        //const shadowGroup = new PIXI.display.Group(1);
        //const cardsGroup = new PIXI.display.Group(2, ((item) => {
        //    item.zOrder = -item.getDepth();
        //    //item.parent.checkFace();
        //}));
        //container.sortableChildren = true;
        //container.addChild(new PIXI.display.Layer(shadowGroup));
        //container.addChild(new PIXI.display.Layer(cardsGroup));

        //const winIcon = new PIXI.Sprite.from("/Content/img/bow.svg");
        //winIcon.height = 48;
        //winIcon.width = 48;

        container.addChild(graphics);
        //graphics.addChild(winIcon);
        this._initCards(this.cards, graphics, this.resources);

        this.game.app.stage.addChild(container);
    }

    _initCards(cards) {
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
        var card = new PIXI.Sprite(this.resources[num + "_" + suit].texture);
        card.scale.x = 0.30;
        card.scale.y = 0.30;

        card.x = card.initialX = x;
        card.y = card.initialY = 120;
        card.interactive = true;
        card.buttonMode = true;
        card.anchor.set(0.5);
        this._adjustCardX(card);

        card.on('pointerdown', this.onPlayerCardDragStart);
        var self = this;
        card.on('pointerup', function (event) {
            self.onPlayerCardDragEnd(event, self);
        });
        card.on('pointerupoutside', function (event) {
            self.onPlayerCardDragEnd(event, self);
        });
        card.on('pointermove', this.onPlayerCardDragMove);

        this.graphics.addChild(card);
    }

    onPlayerCardDragStart(event) {
        console.log(event.data.global.x);
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;

        this.zIndex = Math.max.apply(Math, this.parent.children.map(card => card.zIndex)) + 1;
        this.parent.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }

    onPlayerCardDragEnd(event, self) {
        var card = event.currentTarget;

        card.alpha = 1;
        card.dragging = false;
        card.data = null;

        self._adjustCardX(card);

        

        if (card.y < 110) {
            card.y = 110;
        } else if (card.y > 140) {
            card.y = 140;
        }

        //if (this.position3d) {
        //    if (this.position3d.y > -200 && this.position3d.y < -80 && this.position3d.x > 35 && this.position3d.x < 135) {
        //        var card = this;
        //        window.gameHub.server.playCard(card.num, card.suit).done(function (result) {
        //            if (result) {
        //                card.parent.removeChild(card);
        //            } else {
        //                card.position3d.x = card.initialX;
        //                card.position3d.y = card.initialY;
        //            }
        //        });

        //    } else if (this.position3d.y > -10) {
        //        this.initialX = this.position3d.x;
        //        this.initialY = this.position3d.y;
        //    } else {
        //        this.position3d.x = this.initialX;
        //        this.position3d.y = this.initialY;
        //    }
        //}
    }

    onPlayerCardDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;

            console.log("X = " + newPosition.x);
            console.log("Y = " + newPosition.y);
        }
    }

    _adjustCardX(card) {
        if (card.x < 75) {
            card.x = 75;
        } else if (card.x > 1590) {
            card.x = 1590;
        }
    }
}