class Romi {
    constructor(game) {
        this.game = game;
    }

    init(initialGoal) {
        let self = this;


        document.fonts.load('8pt "Cabin Sketch"').then(() => {
            var goal = new PIXI.Text(initialGoal,
                {
                    fontFamily: 'Cabin Sketch',
                    fontSize: 42,
                    fill: 0xffffff,
                    fontWeight: "500",
                    lineHeight: 4
                });


            goal.x = 800;
            goal.y = 200;

            self.goal = goal;

            self.game.stage.addChild(goal);

            setTimeout(function() {
                    self.onGoalChanged(self, "mojón");
                },
                1500);
        });
    }

    onGoalChanged(self, text) {
        self.goal.text = text;
    }
}