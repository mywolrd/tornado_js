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
        received_maze(data);
        break;

    case 'emaz' :
		received_emaz(data)	
		break;

    case 'strt' : 
		
		initKeyboardInput();
        break;

    case 'fail' : alert('자리 없다. 너 겜 못함ㅋㅋㅋㅋㅋ');
        break;
    }
}

function received_maze(mazestr){
	
	strs = mazestr.split(' ');
	myApp.mazesizew = parseInt(strs[0], 10);
	myApp.mazesizeh = parseInt(strs[1], 10);
	myApp.mazecellw = myApp.stage[0].getWidth()/myApp.mazesizew;
	myApp.mazecellh = myApp.stage[0].getHeight()/myApp.mazesizeh;
	myApp.maze[0] = createGridFromString(strs[2]);
	update();
}

function received_emaz(mazestr){

	myApp.numOfPlayers += 1;
	myApp.maze[myApp.numOfPlayers] = createGridFromString(mazestr);
	myApp.stage[myApp.numOfPlayers] = new Kinetic.Stage({
       									container: myApp.divNames[myApp.numOfPlayers],
       									width: 300, height: 150
   									});
	var layer = new Kinetic.Layer();
	myApp.stage[myApp.numOfPlayers].add(layer);
	$("#"+myApp.divNames[myApp.numOfPlayers]).css("display", "inline");		
	drawEntireMaze(myApp.stage[myApp.numOfPlayers], myApp.maze[myApp.numOfPlayers]);
}

function send_update(){
	
	myApp.ws.send("update "+myApp.curx+" "+myApp.cury);
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

function send_ready(){
	
	if(myApp.ready){
		myApp.ready=false;
		$('#readyButton').text('준비');
		myApp.ws.send("notrd");		
	}else{
		myApp.ready=true;
		$('#readyButton').text('준비 끝!');
		myApp.ws.send("ready");	
	}
}
