class Game {
    private isPlaying: boolean;
    winnerId: string;
    potentialWinnerId: string;
    gameHubReceiver: any;
    confirmVictory: ConfirmVictory;
    deck: any;
    lastPlayedCard: Card;
    playedCard: PlayedCard;
    gameControls: GameControls;
    playerCards: Array<Card>;
    playerDeck: PlayerDeck;
    reactionService: any;
    goal: string;
    resources: any;
    romi: Romi;
    seatTurn: number;
    gameStarted: boolean;
    private isMasterUser: boolean;
    private window;
    private document;
    width: number;
    gameId: string;
    app: PIXI.Application;
    stage: PIXI.Container;
    playerId: string;
    gameHub: GameHub;
    gameHubSender: GameHubSender;
    board: Board;
    players: Players;
    gamePlayers: Array<Player>;


    constructor(gameId: string, document: any, window: any, playerId: string, isMasterUser: boolean, gamePlayers: Array<Player>, gameStarted: boolean, 
        seatTurn: number, resources: any, goal: string, playerCards: Array<Card>, lastPlayedCard: Card, 
        potentialWinnerId: string, winnerId: string, isPlaying: boolean) {
        this.isPlaying = isPlaying;
        this.gamePlayers = gamePlayers;
        this.isMasterUser = isMasterUser;
        this.window = window;
        this.document = document;
        this.gameId = gameId;
        this.playerId = playerId;
        this.gameStarted = gameStarted;
        this.seatTurn = seatTurn;
        this.resources = resources;
        this.goal = goal;
        this.playerCards = playerCards;
        this.lastPlayedCard = lastPlayedCard;
        this.potentialWinnerId = potentialWinnerId;
        this.winnerId = winnerId;
    }

    init() {
        var size = [1920, 1080];
        this.width = size[0];

        this.initApp(size);
        this.initScreen(size, this.app);
        this.initDependencies();
    }

    private initDependencies() {
        this.gameHub = new GameHub(this.gameId, this.playerId);
        this.gameHub.init();

        this.gameHubSender = new GameHubSender(this.gameHub);

        this.board = new Board(this.gameId);
        this.board.init(this.app);

        this.players = new Players(this, this.isMasterUser, this.gameHubSender, this.playerId, this.resources);
        this.gamePlayers.forEach(player => {
            this.players.addPlayer(player.playerId, player.playerName, player.avatar, player.seat, player.winCount);
        });
        if (this.gameStarted) {
            this.players.setCurrentTurn(this.seatTurn);
        }

        this.romi = new Romi(this, this.isMasterUser, this.resources, this.gameHubSender);
        this.romi.init(this.goal); 

        this.reactionService = new ReactionService(this, this.resources, this.gameHubSender);
        this.reactionService.init();

        this.playerDeck = new PlayerDeck(this, this.playerCards, this.resources, this.gameHubSender);
        this.playerDeck.init();

        this.gameControls = new GameControls(this, this.isMasterUser, this.resources, this.gameHubSender, this.playerDeck, false, this.gameStarted, this.isPlaying); 
        this.gameControls.init();

        this.playedCard = new PlayedCard(this, this.players, this.resources, true, this.playerDeck, this.gameHubSender);
        if(this.lastPlayedCard != null) {
            this.playedCard.setPlayedCard(0, this.lastPlayedCard.num, this.lastPlayedCard.suit);
        }

        this.deck = new Deck(this, this.resources, this.playerDeck, this.gameHubSender, this.gameStarted);
        this.deck.init();    

        this.confirmVictory = new ConfirmVictory(this, this.board, this.playerDeck.width, this.deck, this.playedCard);
        this.confirmVictory.init();
        if (this.potentialWinnerId != null){
            this.showPotentialWinner(this.potentialWinnerId);
        }

        this.gameHubReceiver = new GameHubReceiver(this, this.gameHub, this.players, this.romi, this.playedCard, this.reactionService, this.confirmVictory); 
        this.gameHubReceiver.init();

        this.gameHub.connect();

        if(this.winnerId != null){
            this.showWinner(this.winnerId);
        }
    }

    private initApp(size) {
        var options =
        {
            height: size[1],
            width: size[0],
            transparent: true
        };
        const app = new PIXI.Application(options);
        this.app = app;
    }

    private initScreen(size, app) {
        const ratio = size[0] / size[1];
        this.document.body.appendChild(app.view);

        this.window.addEventListener('resize', () => { this.resize(this.document, app, ratio); });
        this.window.onorientationchange = () => { this.resize(this.document, app, ratio); }

        this.stage = app.stage;

        this.resize(this.document, app, ratio);
    }

    private resize(document, app, ratio) {
        let w: number;
        let h: number;

        if (document.body.clientWidth / document.body.clientHeight >= ratio) {
            w = document.body.clientHeight * ratio;
            h = document.body.clientHeight;
        } else {
            w = document.body.clientWidth;
            h = document.body.clientWidth / ratio;
        }

        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    }

    showWinner(winnerPlayerId: string) {
        var winnerPlayer = this.gamePlayers.find(x => x.playerId == winnerPlayerId);
        
        for (var i = this.app.stage.children.length - 1; i >= 0; i--) {	
            this.app.stage.removeChild(this.app.stage.children[i]);
        }
        
        var winner = new Winner(this, this.resources, winnerPlayer);
        winner.init();

        this.gameControls.isGameFinished = true;
        this.gameControls.init();
    }

    showPotentialWinner(potentialWinnerPlayerId: string) {
        this.confirmVictory.show(this.gamePlayers.find(x => x.playerId == potentialWinnerPlayerId).playerName);
    }
}