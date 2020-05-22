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

    _initCards(cards, graphics, resources) {
        //cards are 150 width
        var nextX = 80;
        var zIndex = 0;

        var sepparation = (this.width - nextX - (150 * cards.length)) / cards.length;

        for (var i = 0; i < cards.length; i++) {
            var card = new PIXI.Sprite(resources[cards[i].num + "_" + cards[i].suit].texture);
            card.scale.x = 0.30;
            card.scale.y = 0.30;

            card.x = card.initialX = nextX;
            card.y = card.initialY = 120;
            card.interactive = true;
            card.buttonMode = true;
            card.anchor.set(0.5);
            card.zIndex = zIndex;
            zIndex++;

            card.on('pointerdown', this.onPlayerCardDragStart);
            card.on('pointerup', this.onPlayerCardDragEnd);
            card.on('pointerupoutside', this.onPlayerCardDragEnd);
            card.on('pointermove', this.onPlayerCardDragMove);

            nextX += card.width + sepparation;

            graphics.addChild(card);
        }
    }

    getSnapshotBase64() {
        return this.game.app.renderer.plugins.extract.base64(this.container);
    }

    onPlayerCardDragStart(event) {
        console.log(event.data.global.x);
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;

        this.zIndex = Math.max.apply(Math, this.parent.children.map(card => card.zIndex)) + 1;
        this.parent.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }

    onPlayerCardDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;

        

        if (this.x < 75) {
            this.x = 75;
        } else if (this.x > 1590) {
            this.x = 1590;
        }

        if (this.y < 110) {
            this.y = 110;
        } else if (this.y > 140) {
            this.y = 140;
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
}