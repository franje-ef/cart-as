class Romi {
    constructor(game, isMasterUser) {
        this.game = game;
        this.isMasterUser = isMasterUser;
    }

    init(initialGoal) {
        const loader = new PIXI.Loader();

        loader.add('target', '/Content/img/target.svg');
        loader.add('bow', '/Content/img/bow.svg');
        loader.load((_, resources) => this.onImagesLoaded(resources, this, initialGoal));

        /**
         * /TESTS
         */
        var self = this;
        function timeout() {
            setTimeout(function () {
                var randomGoal = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
                var goals = ["1 trío y 1 seguidilla", "3 tríos", "2 seguidillas", "2 tríos y 1 seguidilla", "libre"];
                self.onGoalChanged(self, goals[randomGoal]);

                timeout();
            }, 1500);
        }

        timeout();
        /*END TESTS*/
    }

    onImagesLoaded(resources, self, initialGoal) {
        document.fonts.load('8pt "Cabin Sketch"').then(() => self.onAssetsLoaded(resources, self, initialGoal));
    }

    onAssetsLoaded(resources, self, initialGoal) {
        var container = new PIXI.Container();
        self.container = container;

        self._addBow(container, self.isMasterUser, resources);
        self._addTarget(container, resources);
        self._addGoal(container, initialGoal, self);
        
        self.game.stage.addChild(container);
        self.locateContainer(self);
    }
    
    onGoalChanged(self, text) {
        self.goal.text = text;
        var originalHeight = self.goal.height;
        
        self.goal.height = 0;

        TweenLite.to(self.goal, 1, {
            
            height: originalHeight,
            ease: Elastic.easeOut
        });

        self.locateContainer(self);
    }

    locateContainer(self) {
        self.container.x = (1920 - self.container.width) / 2;
        self.container.y = 200;
    }

    _addBow(container, isMasterUser, resources) {
        if (isMasterUser) {
            var bow = new PIXI.Sprite(resources.bow.texture);
            bow.height = 64;
            bow.width = 64;
            bow.x = 0;

            bow.interactive = true;
            bow.buttonMode = true;

            bow.mousedown = bow.touchstart = function (event) {
                //TODO send event to server

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

            container.addChild(bow);
        }
    }

    _addTarget(container, resources) {
        var target = new PIXI.Sprite(resources.target.texture);
        target.height = 64;
        target.width = 64;
        target.x = container.width;
        container.addChild(target);
    }

    _addGoal(container, initialGoal, self) {
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