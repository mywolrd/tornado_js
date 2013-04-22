function initStage(){
    
    myApp.myPlayerImage.src = '/img/man_sprite.png'
    myApp.myPlayerImage.onload = function(){
	
	myApp.layer.field.add(myApp.myPlayer);
	myApp.stage.field.add(myApp.layer.field);
    }
    
    myApp.layer.score.add(myApp.text.myScore);
    myApp.layer.score.add(myApp.text.colon);
    myApp.layer.score.add(myApp.text.yourScore);
    myApp.stage.score.add(myApp.layer.score);
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

// arrow keys for moving direction, a,s,d
// e.keyCode = 37    LEFT
// e.keyCode = 38    UP
// e.keyCode = 39    RIGHT
// e.keyCode = 40    DOWN
// e.keyCode = 65    a  attack
// e.keyCode = 83    s  shoot
// e.keyCode = 68    d  pass

function inputHandlerKeyDown(){
    
    // ACTION KEY DOWN
    if ( myApp.keyInput[65] ){	
	attack();
    }else if ( myApp.keyInput[83] ){   
	shoot();
    }
    else if ( myApp.keyInput[68] ){   
	pass();
    }

    //DIRECTION KEY DOWN
    if( myApp.keyInput[37] ){
	if ( myApp.keyInput[38] ){
	}else if ( myApp.keyInput[40] ){
	}else {
	}
    }else if( myApp.keyInput[39] ){
	if ( myApp.keyInput[38] ){
	}else if ( myApp.keyInput[40] ){
	}else {
	}
    }else if ( myApp.keyInput[38] ){
    }else if ( myApp.keyInput[40]) {}    
}

function inputHandlerReleased(){}

function attack(){}
function shoot(){}
function pass(){}

function log(m){

    console.log(m);
}

$(function(){
    initStage();
    initKeyboardInput();
});
