$(function(){
    
    myApp.stage.field = new Kinetic.Stage({
        container: 'canvas',
	width: 1000, height: 500
    });
    
    myApp.stage.score = new Kinetic.Stage({
	container: 'score',
	width: 150, height: 50
    });

    
    myApp.layer.field = new Kinetic.Layer(); 
    myApp.layer.score = new Kinetic.Layer();

    myApp.myPlayerImage = new Image();
    
    myApp.myPlayer = new Kinetic.Sprite({
	x:myApp.x,y:myApp.y,
	image:myApp.myPlayerImage, animation:'idle',
	animations: myApp.sprite, frameRate: 6, index: 0
    });
    
    myApp.text.myScore = new Kinetic.Text({
	fill: 'black',
	align: 'left',
	x: 0, y: 5, width: 65,
	fontSize: 30, fontFamily: 'Calibri',
	text: myApp.myScore.toString()
    });
    
    myApp.text.yourScore = new Kinetic.Text({
	fill: 'black',
	align: 'right',
	x: 85, y: 5, width: 65,
	fontSize: 30, fontFamily: 'Calibri',
	text: myApp.yourScore.toString()
    });

    myApp.text.colon = new Kinetic.Text({
	fill: 'black',
	align: 'center',
	x: 65, y: 2.5, width: 20,
	fontSize: 30, fontFamily: 'Calibri',
	text: ':'
    });
});
    
myApp = {
    
    //SCORE
    myScore : 0,
    yourScore : 0,
    
    //INPUT
    keyInput : {},
    moveKeydown : false,
    currentDirection : 0, // 1  2  3
                          // 4  0  5
                          // 6  7  8
    
    directionCode : {
	
	75 : 1,
	38 : 2,
	77 : 3,
	37 : 4,
	0  : 0,
	39 : 5,
	79 : 6,
	40 : 7,
	81 : 8
	
    },
    

    //PLAYER INFO
    x : 10,
    y : 10,
    ts : 5,
    hasBall : false,
    team : 0,
    
    //GRAPHICS
    sprite : {
	idle:[{x:26, y:30, width:52, height:70},
              {x:128, y:30, width:52, height:70},
              {x:228, y:30, width:52, height:70}],
	walk:[{x:33, y:130, width:34, height:70},
              {x:131, y:130, width:35, height:70},
              {x:227, y:130, width:42, height:70}],
	punch:[{x:34, y:230, width:32, height:70},
               {x:128, y:230, width:47, height:70},
               {x:227, y:230, width:48, height:70}]},

    stage :{},
    layer :{},
    text  :{}
}

