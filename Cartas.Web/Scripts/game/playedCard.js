class PlayedCard {
    constructor(game, players, resources, allowDragAndDrop, playerDeck) {
        this.game = game;
        this.players = players;
        this.resources = resources;
        this.card = null;
        this.allowDragAndDrop = allowDragAndDrop;
        this.playerDeck = playerDeck;
    }

    setPlayedCard(seat, num, suit) {
        var card = new PIXI.Sprite(this.resources[num + "_" + suit].texture);
        card.num = num;
        card.suit = suit;
        card.scale.x = 0.30;
        card.scale.y = 0.30;
        card.anchor.set(0.5);
        card.x = card.initialX = 1225;
        card.y = card.initialY = 425;

        if (this.allowDragAndDrop) {
            this._initDragAndDrop(card);
        }

        this.game.app.stage.addChild(card);
        this._initAnimation(card, seat);
    }

    _initAnimation(card, seat) {
        var width = card.width;
        var height = card.height;

        card.width = 0;
        card.height = 0;

        var from = { width: 15, height: 35, alpha: 0 };
        var to = { duration: 1, width: width, height: height, alpha: 1, ease: "back.inOut(1.7)", onComplete: this._replaceCard, onCompleteParams: [this, card] };

        if (seat > 0) {
            var seatCoordinades = this.players.playerPositions.find(x => x.seat === seat);

            from.x = seatCoordinades.x;
            from.y = seatCoordinades.y;

            to.x = card.x;
            to.y = card.y;
        }

        gsap.fromTo(card, from, to);    
    }

    _replaceCard(self, newCard) {
        if (self.card != null) {
            self.card.parent.removeChild(self.card);
        }

        self.card = newCard;
    }

    _initDragAndDrop(card) {
        card.interactive = true;
        card.buttonMode = true;

        var self = this;
        card.on('pointerdown', this._onCardDragStart);
        card.on('pointerup', function (event) {
            self._onCardDragEnd(event, self);
        });
        card.on('pointerupoutside', function (event) {
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
        if (card.y >= 800 && card.x >= 150 && card.x <= 1810) {
            self.playerDeck.addCardToPlayer(card.num, card.suit, card.x - 150);
            self._replaceCard(self, null);
        } else {
            card.x = card.initialX;
            card.y = card.initialY;
        }

        
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