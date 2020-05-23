class Deck {
    constructor(game, resources, playerDeck) {
        this.game = game;
        this.resources = resources;
        this.playerDeck = playerDeck;
    }

    init() {
        var dummyCard1 = new PIXI.Sprite(this.resources["reverse"].texture);
        dummyCard1.scale.x = 0.30;
        dummyCard1.scale.y = 0.30;
        dummyCard1.x = 700;
        dummyCard1.y = 420;
        dummyCard1.anchor.set(0.5);

        this.game.app.stage.addChild(dummyCard1);

        var dummyCard2 = new PIXI.Sprite(this.resources["reverse"].texture);
        dummyCard2.scale.x = 0.30;
        dummyCard2.scale.y = 0.30;
        dummyCard2.x = 710;
        dummyCard2.y = 420;
        dummyCard2.anchor.set(0.5);

        this.game.app.stage.addChild(dummyCard2);


        var card = new PIXI.Sprite(this.resources["reverse"].texture);
        card.scale.x = 0.30;
        card.scale.y = 0.30;
        card.x = card.initialX = 720;
        card.y = card.initialY = 420;
        card.anchor.set(0.5);
        this.game.app.stage.addChild(card);

        this._initDragAndDrop(card);
    }

    _initDragAndDrop(card) {
        card.interactive = true;
        card.buttonMode = true;

        var self = this;
        card.on('pointerdown', this._onCardDragStart);
        card.on('pointerup',
            function(event) {
                self._onCardDragEnd(event, self);
            });
        card.on('pointerupoutside',
            function(event) {
                self._onCardDragEnd(event, self);
            });
        card.on('pointermove', this._onCardDragMove);
    }

    _onCardDragStart(event) {
        var card = event.currentTarget;

        card.data = event.data;
        card.alpha = 0.5;
        card.dragging = true;
    }

    _onCardDragEnd(event, self) {
        var card = event.currentTarget;

        card.alpha = 1;
        card.dragging = false;
        card.data = null;

        //card grabbed to players Deck
        if (card.y >= 750 && card.x >= 150 && card.x <= 1810) {
            //DEMO
            self.playerDeck.addCardToPlayer(1, 0, card.x - 150);
        }

        card.x = card.initialX;
        card.y = card.initialY;
    }

    _onCardDragMove(event) {
        var card = event.currentTarget;

        if (card.dragging) {
            const newPosition = card.data.getLocalPosition(card.parent);
            card.x = newPosition.x;
            card.y = newPosition.y;

            console.log("X = " + newPosition.x);
            console.log("Y = " + newPosition.y);
        }
    }
}