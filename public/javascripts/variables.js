$(function(){

    myApp.stage.game = new Kinetic.Stage({
        container: 'game',
        width: 1000, height: 500
    });

    myApp.stage.misc = new Kinetic.Stage({
        container: 'misc',
        width: 150, height: 50
    });


    myApp.layer.game = new Kinetic.Layer();
    myApp.layer.misc1 = new Kinetic.Layer();

    myApp.myPlayerImage = new Image();

    myApp.myPlayer = new Kinetic.Sprite({
        x:myApp.x,y:myApp.y,
        image:myApp.myPlayerImage, animation:'idle',
        animations: myApp.sprite, frameRate: 6, index: 0
    });

    myApp.text.time = new Kinetic.Text({
        fill: 'black',
        align: 'center',
        x: 65, y: 2.5, width: 20,
        fontSize: 30, fontFamily: 'Calibri',
        text: '0'
    });
});

myApp = {

    //TIME                                                                     
    time : 0,

    //INPUT                                                                     
    keyInput : {},
    moveKeydown : false,
    currentDirection : 0, //    1                                              
                          // 2  0  3                                            
                          //    4                                              

    //GAME INFO
    ready : false,
    ingame: false,
    
    //PLAYER INFO
    x : 10,
    y : 10,
    ts : 5,
 
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
