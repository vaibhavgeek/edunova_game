
window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls(true).touch()

Q.Sprite.extend("Player",{

  init: function(p) {
   
    this._super(p, {
      sheet: "main",
      sprite: "player",
      jumpSpeed: -550,
       speed: 200 ,
      frame: 1
    });

    this.add('2d, platformerControls,animation');


  },
   step: function(dt) {
            if(Q.inputs['right']) {
      this.play("run_right");
    } else if(this.p.vx < 0) {
      this.play("run_left");
    } else {
      this.play("stand");
    }
        },

});
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});
Q.scene("level1",function(stage) {

//stage.insert(new Q.Repeater({ asset: "wall2.png",repeatY:true, speedX: 0.5, speedY: 0.5 })); 
  Q.stageTMX("level1.tmx",stage);
  var player = stage.insert(new Q.Player({x:200,y:300}));
   stage.add("viewport").follow(player);
   stage.insert(new Q.Tower({ x:1330, y: 600 }));
});




// Load one or more TMX files
// and load all the assets referenced in them
Q.loadTMX("level1.tmx,wall2.png,main.json,main.png", function() {
  Q.compileSheets("main.png","main.json");

        Q.animations('player', {
        run_left: { frames: [11,12,13,14,15,16,17,18,19], next: 'stand_left', rate: 1/10},
        run_right: { frames: [0,1,2,3,4,5,6,7,8,9], next: 'stand_right', rate: 1/10},
        stand: { frames: [0]},
        jump: { frames: [8], loop:false, rate: 1},
    });
  Q.stageScene("level1");
});


});
