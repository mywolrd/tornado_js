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
		update();
        break;

    case 'emaz' :
		received_emaz(data)	
		break;

    case 'strt' : 
		initKeyboardInput();
        break;

	case 'updt' :
		updateEnemy(data);
		break;
	case 'left' :
		player_left(data);
		break;
    case 'fail' : alert('NO MORE ROOM. YOU CANT PLAY LOLZ');
        break;
    }
}

function received_maze(mazestr){
	
	strs = mazestr.split(' ');
	myApp.id = parseInt(strs[0], 10);

	myApp.mazesizew = parseInt(strs[1], 10);
	myApp.mazesizeh = parseInt(strs[2], 10);
	myApp.maze[myApp.id] = createGridFromString(strs[3]);

	initVariables();
    initStage();
}

function received_emaz(mazestr){
	
	strs = mazestr.split(' ');
	id = parseInt(strs[0], 10);
	index = getdivNameIndex();

	myApp.maze[id] = createGridFromString(strs[1]);

	myApp.stage[id] = new Kinetic.Stage({
       									container: myApp.divNames[index],
       									width: 300, height: 150
   									});
	var layer = new Kinetic.Layer();
	myApp.stage[id].add(layer);
	$("#"+myApp.divNames[index]).css("display", "inline");		
	drawEntireMaze(myApp.stage[id], myApp.maze[id]);
	initEnemyPlayer(id);
}

function getdivNameIndex(){

	var index = myApp.divNameFree.shift();
	myApp.divNameInUse.unshift(index);
	return index;
}

function player_left(indexstr){

	var index = parseInt(indexstr, 10);
	var divName = myApp.stage[index].getContainer().getAttribute('id');	
	$("#"+divName).css("display", "none");
	//Do I need to reset stage, maze, player?
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
	
	/*if(myApp.ready){
		myApp.ready=false;
		$('#readyButton').text('READY');
		myApp.ws.send("notrd");		
	}else{*/
	myApp.ready=true;
	$('#readyButton').text('STARTING....!');
	myApp.ws.send("ready");	
	//}
}
