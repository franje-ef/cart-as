class Romi {
    game: Game;
    isMasterUser: boolean;
    resources: any;
    gameHubSender: GameHubSender;
    container: PIXI.Container;
    goal: any;

    constructor(game: Game, isMasterUser:boolean, resources, gameHubSender: GameHubSender) {
        this.game = game;
        this.isMasterUser = isMasterUser;
        this.resources = resources;
        this.gameHubSender = gameHubSender;
    }

    init(initialGoal) {
        var container = new PIXI.Container();
        this.container = container;

        this.addBow(container, this.isMasterUser, this.resources, this.gameHubSender);
        this.addTarget(container, this.resources);
        this.addGoal(container, initialGoal, this);
        this.game.stage.addChild(container);
        this.locateContainer(this);
    }

    onGoalChanged(text) {
        this.goal.text = text;
        var originalHeight = this.goal.height;
        
        this.goal.height = 0;

        TweenLite.to(this.goal, 1, {
            
            height: originalHeight,
            ease: Elastic.easeOut
        });

        this.locateContainer(this);
    }

    locateContainer(self) {
        self.container.x = (1920 - self.container.width) / 2;
        self.container.y = 200;
    }

    private addBow(container, isMasterUser, resources, gameHubSender) {
        if (isMasterUser) {
            var bow = new PIXI.Sprite(resources.bow.texture);
            bow.height = 64;
            bow.width = 64;
            bow.x = 0;

            bow.interactive = true;
            bow.buttonMode = true;
            bow.on("mousedown",
                event => {
                    this.changeGoalClicked(event, this.gameHubSender);
                });
            bow.on("touchstart",
                event => {
                    this.changeGoalClicked(event, this.gameHubSender);
                });

            container.addChild(bow);
        }
    }

    private changeGoalClicked(event, gameHubSender: GameHubSender) {
        gameHubSender.changeGoal();

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

    private addTarget(container, resources) {
        var target = new PIXI.Sprite(resources.target.texture);
        target.height = 64;
        target.width = 64;
        target.x = container.width;
        container.addChild(target);
    }

    private addGoal(container, initialGoal, self) {
        var goal = new PIXI.Text(initialGoal,
            {
                fontFamily: 'Cabin Sketch',
                fontSize: 42,
                fill: 0xffffff,
                fontWeight: "500",
                lineHeight: 4
            });
        goal.x = container.width + 2;
        goal.y = 10;

        container.addChild(goal);

        self.goal = goal;
    }
}