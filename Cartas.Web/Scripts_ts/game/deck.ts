class Deck {
    private gameStarted: boolean;
    game: Game;
    resources: any;
    playerDeck: any;
    gameHubSender: GameHubSender;
    dummyCard1: PIXI.Sprite;
    dummyCard2: PIXI.Sprite;
    card: any;

    constructor(game: Game, resources, playerDeck, gameHubSender: GameHubSender, gameStarted: boolean) {
        this.gameStarted = gameStarted;
        this.game = game;
        this.resources = resources;
        this.playerDeck = playerDeck;
        this.gameHubSender = gameHubSender;
    }

    init() {
        var dummyCard1 = new PIXI.Sprite(this.resources["reverse"].texture);
        dummyCard1.scale.x = 0.30;
        dummyCard1.scale.y = 0.30;
        dummyCard1.x = 700;
        dummyCard1.y = 420;
        dummyCard1.anchor.set(0.5);

        this.dummyCard1 = dummyCard1;
        this.game.app.stage.addChild(dummyCard1);

        var dummyCard2 = new PIXI.Sprite(this.resources["reverse"].texture);
        dummyCard2.scale.x = 0.30;
        dummyCard2.scale.y = 0.30;
        dummyCard2.x = 710;
        dummyCard2.y = 420;
        dummyCard2.anchor.set(0.5);

        this.dummyCard2 = dummyCard2;
        this.game.app.stage.addChild(dummyCard2);


        var card = new CardSprite(this.resources["reverse"].texture);
        card.scale.x = 0.30;
        card.scale.y = 0.30;
        card.x = card.initialX = 720;
        card.y = card.initialY = 420;
        card.anchor.set(0.5);

        this.card = card;
        this.game.app.stage.addChild(card);

        if (this.gameStarted) {
            this.initDragAndDrop(card);
        }
    }

    hide() {
        this.dummyCard1.visible = false;
        this.dummyCard2.visible = false;
        this.card.visible = false;
    }

    show() {
        this.dummyCard1.visible = true;
        this.dummyCard2.visible = true;
        this.card.visible = true;
    }

    private initDragAndDrop(card) {
        card.interactive = true;
        card.buttonMode = true;

        card.on('pointerdown', this.onCardDragStart);
        card.on('pointerup',
            event => {
                this.onCardDragEnd(event, this);
            });
        card.on('pointerupoutside',
            event => {
                this.onCardDragEnd(event, this);
            });
        card.on('pointermove', this.onCardDragMove);
    }

    private onCardDragStart(event) {
        var card = event.currentTarget;

        card.data = event.data;
        card.alpha = 0.5;
        card.dragging = true;
    }

    private onCardDragEnd(event, self) {
        var card = event.currentTarget;

        card.alpha = 1;
        card.dragging = false;
        card.data = null;

        //card grabbed to players Deck
        if (card.y >= 750 && card.x >= 150 && card.x <= 1810) {
            self.gameHubSender.takeDeckCard().done(takenCard => {
                if (takenCard != null) {
                    self.playerDeck.addCardToPlayer(takenCard.Num, takenCard.Suit, card.x - 150);
                }
            });
        }

        card.x = card.initialX;
        card.y = card.initialY;
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