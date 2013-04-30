function initKeyboardInput(){

    $(document).keydown(function (e){
        keyCode = e.which;
        
		if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39)
			e.preventDefault();

		switch(keyCode) {
			
			case 37 : 	moveLeft();
						break;
			case 38 :	moveUp();
						break;
			case 39 :	moveRight();
						break;
			case 40 :	moveDown();
						break;				
		}
		update(); 	
    });

    $(document).keyup(function (e){
        keyCode = e.which;
        myApp.keyInput[keyCode] = false;
        //inputHandlerReleased();
    });
}

$(function(){

    initWebSocket();
	
});

