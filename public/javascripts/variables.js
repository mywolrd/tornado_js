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
    goalx : 19,
    goaly :  9,
    curx :0,
    cury :0,
    enemyPlayer: [],

    //PLAYER INFO
    x : 0,
    y : 0,
    ts : 7,
    id : -1,
 
    //GRAPHICS
    sprite : {
        down:[{x:0, y:2, width:33, height:34},
              {x:46, y:2, width:33, height:34},
              {x:91, y:2, width:33, height:34}],

        right:[{x:0, y:37, width:33, height:35},
              {x:46, y:37, width:33, height:35},
              {x:92, y:37, width:32, height:35}],

        up:[{x:0, y:73, width:33, height:34},
               {x:46, y:73, width:33, height:34},
               {x:91, y:73, width:33, height:34}],

        left:[{x:0, y:108, width:31, height:35},
            {x:45, y:108, width:31, height:35},
            {x:91, y:108, width:31, height:35}]},


    stage :[],
    layer :{},
    maze : [],
    player:[],
    divNames:["none", "enemy1","enemy2","enemy3","enemy4","enemy5","enemy6"],
    divNameInUse: [],
    divNameFree: [1,2,3,4,5,6]
}
