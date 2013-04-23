function initStage(){

    myApp.myPlayerImage.src = $("#image1")[0].src
    myApp.myPlayerImage.onload = function(){

        //myApp.layer.game.add(myApp.myPlayer);
        //myApp.stage.game.add(myApp.layer.game);
    }

    myApp.layer.misc1.add(myApp.text.time);
    myApp.stage.misc.add(myApp.layer.misc1);
}

function initKeyboardInput(){

    $(document).keydown(function (e){
        keyCode = e.which;
        if (keyCode == 38 || keyCode == 40) e.preventDefault();
        if ( 37 <= keyCode <= 40 ) myApp.moveKeydown = true;
        myApp.keyInput[keyCode] = true;
        //inputHandlerKeyDown();
    });

    $(document).keyup(function (e){
        keyCode = e.which;
        myApp.keyInput[keyCode] = false;
        //inputHandlerReleased();
    });
}

function initWebSocket(){
    
    myApp.ws = new WebSocket("ws://" + window.location.host + ":8001/ws");
    
    myApp.ws.onopen = function(e){
	
    };

    myApp.ws.onmessage = function (e){
	messageHandler(e.data);
    };
}

function ready(){
    myApp.ready = true;
    myApp.ws.send("ready");
}

function messageHandler(str){

    req = str.slice(0, 4);
    data = str.slice(5, str.length);
    var callback;

    switch(req){
    
    case 'maze' : 

	callback = function(str){
	    
	    strs = str.split(' ');
	    myApp.mazesize = parseInt(strs[0], 10);
	    maze = strs[1].split(',');	
	    myApp.maze = [];
	    
	    for(var i = 0; i < myApp.mazesize; i++){
		
		myApp.maze[i] = [];
		for(var j = 0; j < myApp.mazesize; j++){
		    myApp.maze[i][j] = parseInt(maze[(i*10)+j], 10);
		}
	    }
	    drawMaze();
	};
	break;
	
    case 'strt' : log('start');
        break;
    
    case 'fail' : log(data);
        break;
    }
    
    callback(data);
}

function drawMaze(){

    initStage();

    var getWalls = function(x,y){
	// returns 0 if (x, y) cell has no east, no south wall
	//         1 if (x, y) cell has east, no south wall
	//         2 if (x, y) cell has south wall, no east wall
	//         3 if (x, y) cell has east and south wall
	var wall = 0;
	if( (myApp.maze[i][j] & 1) == 0)    wall = 1;

	if( (myApp.maze[i][j] & 4) == 0){
	    if( wall == 1)
		wall = 3;
	    else
		wall = 2;
	}
	return wall;
    }

    x = myApp.stage.game.getWidth() / myApp.mazesize;
    y = myApp.stage.game.getHeight() / myApp.mazesize;

    for(var i = 0; i < myApp.mazesize; i++){
	for(var j = 0; j < myApp.mazesize; j++){

	    walls = getWalls(i, j);

	    if(walls != 0){
		if( (walls & 1) != 0 ){

		}
		if( (walls & 2) != 0){


		}
	    }
	}
    }
}


function inputHandlerKeyDown(){

}

function inputHandlerKeyReleased(){

}

function log(m){
    console.log(m);
}

$(function(){

    initKeyboardInput();
    initWebSocket();
});

