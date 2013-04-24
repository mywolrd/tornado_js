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
	    myApp.mazesizew = parseInt(strs[0], 10);
	    myApp.mazesizeh = parseInt(strs[1], 10);
	    maze = strs[2].split(',');	
	    myApp.maze = [];
	    
	    for(var i = 0; i < myApp.mazesizew; i++){
		
		myApp.maze[i] = [];
		for(var j = 0; j < myApp.mazesizeh; j++){
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

