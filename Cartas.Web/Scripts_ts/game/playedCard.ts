class PlayedCard {
    game: Game;
    players:Players;
    resources;
    card: any;
    allowDragAndDrop: boolean;
    playerDeck;
    gameHubSender: GameHubSender;
    container: PIXI.Container;
    
    constructor(game: Game, players: Players, resources, allowDragAndDrop: boolean, playerDeck, gameHubSender: GameHubSender) {
        this.game = game;
        this.players = players;
        this.resources = resources;
        this.card = null;
        this.allowDragAndDrop = allowDragAndDrop;
        this.playerDeck = playerDeck;
        this.gameHubSender = gameHubSender;
        this.container = this.game.app.stage;
    }

    setPlayedCard(seat: number, num: number, suit:number) {
        var card = new CardSprite(this.resources[num + "_" + suit].texture);
        card.num = num;
        card.suit = suit;
        card.scale.x = 0.30;
        card.scale.y = 0.30;
        card.anchor.set(0.5);
        card.x = card.initialX = 1225;
        card.y = card.initialY = 425;

        if (this.allowDragAndDrop) {
            this.initDragAndDrop(card);
        }

        this.initAnimation(card, seat); 
    }

    removePlayedCard() {
        if (this.card != null) {
            this.card.parent.removeChild(this.card);
            this.card = null;
        }
    }

    hide() {
        if (this.card != null)
            this.card.visible = false;
    }

    show() {
        if (this.card != null)
            this.card.visible = true;
    }

    private initAnimation(card: CardSprite, seat: number) {
        var width = card.width;
        var height = card.height;

        card.width = 0;
        card.height = 0;

        var from: any = { width: 15, height: 35, alpha: 0};
        var to: any = {
            duration: 0.5,
            width: width,
            height: height,
            ease: "back.inOut(1.7)",
            alpha: 1
            //onComplete: this.replaceCard,
            //onCompleteParams: [this, card] 
        };

        if (seat > 0) {
            var seatCoordinades = this.players.playerPositions.find(x => x.seat === seat);

            from.x = seatCoordinades.x;
            from.y = seatCoordinades.y;

            to.x = card.x;
            to.y = card.y;
            to.duration = 1.5;
        }

        this.removeCard(this);
        this.card = card;
        this.container.addChildAt(card, 5);

        var tl = gsap.timeline();
        tl.fromTo(card, from, to);

    }

    private removeCard(self: PlayedCard) {
        if (self.card != null) {
            self.container.removeChild(self.card);
        }
    }

    private initDragAndDrop(card: CardSprite) {
        card.interactive = true;
        card.buttonMode = true;

        var self = this;
        card.on('pointerdown', this.onCardDragStart);
        card.on('pointerup',
            function(event) {
                self.onCardDragEnd(event, self);
            });
        card.on('pointerupoutside',
            function(event) {
                self.onCardDragEnd(event, self);
            });
        card.on('pointermove', this.onCardDragMove);
    }

    private onCardDragStart(event) {
        var card = event.currentTarget;

        card.data = event.data;
        card.alpha = 0.5;
        card.dragging = true;
    }

    private onCardDragEnd(event, self: PlayedCard) {
        var card = event.currentTarget;

        card.alpha = 1;
        card.dragging = false;
        card.data = null;

        //card grabbed to players Deck
        if (card.y >= 800 && card.x >= 150 && card.x <= 1810) {
            self.gameHubSender.takePlayedCard().done(function(playedCard) {
                if (playedCard != null) {
                    self.playerDeck.addCardToPlayer(playedCard.Num, playedCard.Suit, card.x - 150);
                    self.removeCard(self);
                } else {
                    card.x = card.initialX;
                    card.y = card.initialY;
                }
            });

        } else {
            card.x = card.initialX;
            card.y = card.initialY;
        }


    }

    private onCardDragMove(event) {
        var card = event.currentTarget;

        if (card.dragging) {
            const newPosition = card.data.getLocalPosition(card.parent);
            card.x = newPosition.x;
            card.y = newPosition.y;

            //console.log("X = " + newPosition.x);
            //console.log("Y = " + newPosition.y);
        }
    }


}