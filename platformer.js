
window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Audio,Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
        .setup("mygame",{ maximize: true })
        .controls(true).touch().enableSound()

Q.Sprite.extend("Player",{

  init: function(p) {
   
    this._super(p, {
      sheet: "main",
      sprite: "player",
       jumpSpeed: -550,
       speed: 200 ,
        standingPoints: [ [8,30],[-8,30],[-8,-30],[8,-30]],
    //  duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-48], [23,-10], [23, 35 ], [ 16, 44 ]],
      frame: 1,
       type: Q.SPRITE_PLAYER,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY

    });
  this.p.points = this.p.standingPoints;


    this.add('2d, platformerControls,animation');
    this.on("hit.sprite",function(collision) {

                if(collision.obj.isA("Door")) {
            Q.stageScene("endGame",1, { label: "You Won!" }); 
            this.destroy();
            
          
      
          }
        });

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
Q.Sprite.extend("Door",{
  init: function(p){
    this._super(p,{
      sheet:"door",
      collisionMask: Q.SPRITE_PLAYER
    });
  }
});
Q.Sprite.extend("Enemy", {
  init: function(p) {

    this._super(p,{
      sheet: p.sprite,
      vx: 150,
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT |Q.SPRITE_ENEMY 
    });

    this.add("2d, aiBounce, animation");
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
                 Q.stageScene("endGame",2, { label: "You Died" });   
                collision.obj.destroy();
      }
    });
      this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.audio.play("hit.mp3");
        this.destroy(); 
        collision.obj.p.vy = -300; 
 // alert("x="+collision.obj.p.x+"  y="+collision.obj.p.y);
      }
    });
  },
  step: function(dt) {
        if(this.p.vx > 0) {
          this.p.flip="x";
          this.play("walk");
        } else if(this.p.vx < 0) {
          this.p.flip="";
          this.play("walk");
        }
    },
});
Q.Enemy.extend("Snail", {
  init: function(p) {
    this._super(p,{
    //  w: 55,
      //h: 34
    });
  }

});
Q.Enemy.extend("Fly", {
  init: function(p) {
    this._super(p,{
     w: 55,
      h: 34
    });
  }

});
Q.Enemy.extend("Slime", {
  init: function(p) {
    this._super(p,{
     w: 55,
      h: 36
    });
  }

});
var cnt=0,temp;

Q.Sprite.extend("Pole",{
  init:function(p){
    this._super(p,{
      sheet:p.sprite,
       scale:2,
      frame:1,
       collisionMask: Q.SPRITE_PLAYER,
    });
     this.add('2d,animation');
    this.on("bump.left,bump.right,bump.top",function(collision){ 
  if(collision.obj.isA("Player"))
  {
    this.play("open");
     if(cnt==0 || temp!=p.flag_no )
        { cnt++;
          temp=p.flag_no;
           Q.output(this.p);
        }    
   
  }
});
       
}
});

  Q.output=function(p)
  { 
    var rad={"q1":{"qt":"who created c++ ?","1":"Bjarne Stroustrup","2":"Neil Armstrong","3":"Dennis Ritchie","4":"Aishwarya","correct":"1"},
          "q2":{"qt":"can computers out perform humans?","1":"yes!","2":"no!","3":"maybe?","4":"i dont know!","correct":"2"},
          "q3":{"qt":"cout is used for which purpose?","1":"store information","2":"for taking input","3":"displaying ouput","4":"none of these","correct":"3"},
          "q4":{"qt":"what do header files contain?","1":"previous programs","2":"predeclared function libraries","3":"output of the program","4":"all of these","correct":"2"}};

 document.getElementById("t").innerHTML=rad["q"+cnt]["qt"];
for( var i=1;i<5;i++)
 document.getElementById(i).innerHTML=rad["q"+cnt][""+i];


 var xi= window.innerWidth/2-30, yi= window.innerHeight/2;
$('#e').popover({ html : true, 
        content: function() {
          return $('#but').html();
        }
      });
 $('#e').css({'position':'absolute','top':yi,'right':xi}).popover('show');
  if(cnt==0 || temp!=p.flag_no )
 { cnt++;temp=p.flag_no;}
 console.log("cnt="+cnt);
 $('#e').on('shown.bs.popover', function (e) { $('#b').show();
      Q.pauseGame();
 });
closeb=0;
 $('#check').click(function(){
                
                       if($('input[name=optradio]:checked').val()==rad["q"+cnt]["correct"])
               {$("#msg").html('<i class="fa fa-check" style="font-size:30px;color:green"></i> CORRECT ANSWER');
                closeb=1;
                } 
              else
                { cnt--;
               $("#msg").html('<i class="fa fa-close" style="font-size:30px;color:red"></i> WRONG ANSWER');
               closeb=2;
                }
                $('#check').remove();
                     });
 $('#close').click(function(){
            if(closeb==1)
                     {$('#b').hide();
                      $('#e').popover('hide');
                       Q.unpauseGame();
                       $('#mygame').focus();} 
                       else if(closeb==2)
                       {
                        $('#e').popover('hide');
                        Q.stageScene("note");
                       }
                        
                     });

  }

Q.Sprite.extend("Coin",{
  init:function(p){
              this._super(p,{ 
                sheet:p.sprite,
                gravity:0,
                collisionMask: Q.SPRITE_PLAYER,
               });
               this.add('2d,animation');
              this.on("bump.left,bump.right,bump.top",function(collision){ 
            if(collision.obj.isA("Player"))
            {Q.audio.play('coin.mp3');
               this.destroy(); 
             }
          });
                 
         }
});

Q.scene('note',function(stage){
  $('#exampleModal').modal('show') ;
$('#exampleModal').on('shown.bs.modal', function (e) {
  Q.pauseGame();
})
$('#exampleModal').on('hidden.bs.modal', function (e) {
  Q.unpauseGame();
   $('#mygame').focus();
    Q.stageScene("level");
 })
});
Q.scene("level",function(stage) {

//stage.insert(new Q.Repeater({ asset: "back.png",repeatY:true, speedX: 10, speedY: 0.5 })); 
  Q.stageTMX("level.tmx",stage);
  var player = stage.insert(new Q.Player({x:200,y:500}));
   stage.add("viewport").follow(player);

});


Q.scene('endGame',function(stage) {
      var container = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
      }));
 
      var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                      label: "Play Again" }))        
      var label = container.insert(new Q.UI.Text({x:0, y: -10 - button.p.h, color: "#ffffff",
                                                       label: stage.options.label }));
       
      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('note');
      });
 
        container.fit(20);
});

Q.loadTMX("level.tmx,main.json,main.png,enemies.png,enemies.json, coin.mp3,hit.mp3,bird.json,bird.png,pole.json,pole.png,collectables.json,collectables.png", function() {
  Q.compileSheets("door.png","door.json");
  Q.compileSheets("main.png","main.json");
 Q.compileSheets("enemies.png","enemies.json");
 Q.compileSheets("pole.png","pole.json");
 Q.compileSheets("collectables.png","collectables.json");
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
  Q.stageScene("note");
},{ progressCallback: function(loaded,total){
 var element = document.getElementById("loading");
    element.style.width = Math.floor(loaded/total*100) + "%";
   if (loaded == total) {
      document.getElementById("loading").remove();
    }
}
});


});
