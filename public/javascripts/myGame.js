function initStage(){

    myApp.myPlayerImage.src = $("#image1")[0].src
    myApp.myPlayerImage.onload = function(){

        myApp.layer.game.add(myApp.myPlayer);
        myApp.stage.game.add(myApp.layer.game);
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
        inputHandlerKeyDown();
    });

    $(document).keyup(function (e){
        keyCode = e.which;
        myApp.keyInput[keyCode] = false;
        inputHandlerReleased();
    });
}

function initWebSocket(){
    
    myApp.ws = new WebSocket("ws://" + window.location.host + ":8001/ws");
    
    myApp.ws.onopen = function(e){
	console.log("Hello");
    };

    myApp.ws.onmessage = function (e){
	log(e.data);
    };
}

function inputHandlerKeyDown(){

}

function inputHandlerKeyReleased(){

}

function log(m){

    console.log(m);
}

$(function(){
    initStage();
    initKeyboardInput();
    initWebSocket();
});

