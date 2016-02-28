
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
      frame: 1,
       type: Q.SPRITE_PLAYER,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY

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

Q.Sprite.extend("Enemy", {
  init: function(p) {

    this._super(p,{
      sheet: p.sprite,
      vx: 150,
     // defaultDirection: 'left',
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT |Q.SPRITE_ENEMY 
    });

    this.add("2d, aiBounce, animation");
   // this.on("bump.top",this,"die");
    //this.on("hit.sprite",this,"hit");
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("level1");
                collision.obj.destroy();
      }
    });
      this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy(); 
        collision.obj.p.vy = -300;
             
 // alert("x="+collision.obj.p.x+"  y="+collision.obj.p.y);
      }
    });
  },
  step: function(dt){
    this.play('walk');
  }
});
Q.Enemy.extend("Snail", {
  init: function(p) {
    this._super(p,{
     //sheet:"snail",
    //  w: 55,
      //h: 34
    });
  }

});
Q.Enemy.extend("Fly", {
  init: function(p) {
    this._super(p,{
    // sheet:"fly",
     w: 55,
      h: 34
    });
  }

});
Q.Enemy.extend("Slime", {
  init: function(p) {
    this._super(p,{
   //  sheet:"slime",
     w: 55,
      h: 36
    });
  }

});
Q.Sprite.extend("Pole",{
  init:function(p){
    this._super(p,{
      sheet:p.sprite,
       scale:2,
      frame:1,
       collisionMask: Q.SPRITE_PLAYER,
    });
     this.add('2d,animation');
    this.on("bump.left,bump.right,bump.top",function(collision){ console.log("gffgfg");
  if(collision.obj.isA("Player"))
  {console.log("right");
    this.play("open");
 }
});
       
}
});
Q.scene("level1",function(stage) {

//stage.insert(new Q.Repeater({ asset: "back.png",repeatY:true, speedX: 10, speedY: 0.5 })); 
  Q.stageTMX("level1.tmx",stage);
  var player = stage.insert(new Q.Player({x:200,y:300}));
   stage.add("viewport").follow(player);
   stage.insert(new Q.Tower({ x:1330, y: 600 }));
});




// Load one or more TMX files
// and load all the assets referenced in them
Q.loadTMX("level1.tmx,main.json,main.png,enemies.png,enemies.json,bird.json,bird.png,pole.json,pole.png", function() {
  Q.compileSheets("main.png","main.json");
 Q.compileSheets("enemies.png","enemies.json");
 Q.compileSheets("pole.png","pole.json");
        Q.animations('player', {
        run_left: { frames: [11,12,13,14,15,16,17,18,19], next: 'stand_left', rate: 1/10},
        run_right: { frames: [0,1,2,3,4,5,6,7,8,9], next: 'stand_right', rate: 1/10},
        stand: { frames: [0]},
        jump: { frames: [8], loop:false, rate: 1},
    });
         var EnemyAnimations = {
      walk: { frames: [0,1], rate: 1/3, loop: true },
      dead: { frames: [2], rate: 1/10 }
    };
    Q.animations("fly", EnemyAnimations);
    Q.animations("slime", EnemyAnimations);
    Q.animations("snail", EnemyAnimations);
    Q.animations('pole',{
    closed:{frames:[1],rate:1/10,flip: false},
    open:{frames:[3,4,5,6,7,8,9,10,11],rate: 1/5, flip: false, loop: true }
  });
  /* Q.animations("bird",{
    fly:{frames:[0,1,2,3,4,5,6,7],rate:1/5,loop:true}
   });
  */
  Q.stageScene("level1");
},{ progressCallback: function(loaded,total){
 var element = document.getElementById("loading");
    element.style.width = Math.floor(loaded/total*100) + "%";
   if (loaded == total) {
      document.getElementById("loading").remove();
    }
}
});


});
