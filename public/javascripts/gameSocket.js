function initWebSocket(){

    myApp.ws = new WebSocket("ws://" + window.location.host + ":8001/ws");

    myApp.ws.onopen = function(e){

    };

    myApp.ws.onmessage = function (e){
        messageHandler(e.data);
    };
}

function messageHandler(str){

    req = str.slice(0, 4);
    data = str.slice(5, str.length);

    switch(req){

    case 'maze' :
        strs = data.split(' ');
        myApp.mazesizew = parseInt(strs[0], 10);
		myApp.mazesizeh = parseInt(strs[1], 10);
		myApp.mazecellw = myApp.stage.game.getWidth()/myApp.mazesizew;
		myApp.mazecellh = myApp.stage.game.getHeight()/myApp.mazesizeh;
       	myApp.maze[0] = createGridFromString(strs[2]);
		update();
        break;

    case 'emaz' :
	strs = data.split(' ');
	break;

    case 'strt' : log('start');
        break;

    case 'fail' : alert('자리 없다. 너 겜 못함ㅋㅋㅋㅋㅋ');
        break;
    }
}

function createGridFromString(str){

    maze = str.split(',');
    tempmaze = [];
    
    for(var i = 0; i < myApp.mazesizew; i++){
	
        tempmaze[i] = [];
        for(var j = 0; j < myApp.mazesizeh; j++){
            tempmaze[i][j] = parseInt(maze[(i*10)+j], 10);
        }
    }
	return tempmaze
}
