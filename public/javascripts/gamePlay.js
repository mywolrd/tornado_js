function moveUp(){
	
	if(myApp.currentDirection != 1){
		myApp.myPlayer.setAnimation('up');		
		myApp.currentDirection = 1;
	}

	if(canIgo(myApp.x, myApp.y, myApp.x+myApp.myPlayer.getAnimations()['up'][0].width, myApp.y)){
		myApp.y -= myApp.ts;		
		myApp.myPlayer.setY(myApp.y);
	}
}

function moveDown(){

	if(myApp.currentDirection != 4){
		myApp.myPlayer.setAnimation('down');
		myApp.currentDirection = 4;
	}
	
	if(canIgo(myApp.x, myApp.y+myApp.myPlayer.getAnimations()['down'][0].height, 
			myApp.x+myApp.myPlayer.getAnimations()['down'][0].width,
			myApp.y+myApp.myPlayer.getAnimations()['down'][0].height)){				
		myApp.y += myApp.ts;
		myApp.myPlayer.setY(myApp.y);
	}
}

function moveLeft(){
	
	if(myApp.currentDirection != 2){
		myApp.myPlayer.setAnimation('left');
		myApp.currentDirection = 2;
	}

	if(canIgo(myApp.x, myApp.y, myApp.x, myApp.y+myApp.myPlayer.getAnimations()['left'][0].width)){
		myApp.x -= myApp.ts;
		myApp.myPlayer.setX(myApp.x);
	}
}

function moveRight(){

	if(myApp.currentDirection != 3){
		myApp.myPlayer.setAnimation('right');
		myApp.currentDirection = 3;	
	}

	if(canIgo(myApp.x+myApp.myPlayer.getAnimations()['right'][0].width, myApp.y,
				myApp.x+myApp.myPlayer.getAnimations()['right'][0].width,
				myApp.y+myApp.myPlayer.getAnimations()['right'][0].height)){
		myApp.x += myApp.ts;
		myApp.myPlayer.setX(myApp.x);
	}
}

function canIgo(x1, y1, x2, y2){
	
	var collision = 0;
	var wall = [0,8,2,1,4];

	var getDS=function(dir){
		// dir == 1 in Y direction
		// dir == 0 in X direction
		var ds = 0;
		switch(myApp.currentDirection){
			case 1: ds = (dir == 1) ? (myApp.ts * -1) : 0;
					break;
			case 2: ds = (dir == 0) ? (myApp.ts * -1) : 0;
					break;
			case 3: ds = (dir == 0) ? myApp.ts : 0;
					break;
			case 4: ds = (dir == 1) ? myApp.ts : 0;
					break;
		}
		return ds;
	}
		
	var x1_cor = getXindex(x1);	
	var y1_cor = getYindex(y1);

	var x2_cor = getXindex(x2);	
	var y2_cor = getYindex(y2);

	var next_x1 = getXindex(x1 + getDS(0));
	var next_y1 = getYindex(y1 + getDS(1));

	var next_x2 = getXindex(x2 + getDS(0));
	var next_y2 = getYindex(y2 + getDS(1));

	//console.log(x1_cor+" " +y1_cor+" " +x2_cor+" " +y2_cor);
	//console.log(next_x1+" " +next_y1+" " +next_x2+" " +next_y2);

	if(( next_x1 >= 0 && next_x1 < myApp.mazesizew) && (next_x2 >= 0 && next_x2 < myApp.mazesizew) 
		&& (next_y1 >= 0 && next_y1 < myApp.mazesizeh) && ( next_y2 >= 0 && next_y2 < myApp.mazesizeh)){
		
		// Check for wall collision
		// 1111	4 bits in a cell representing north, south, west, east path
		// If a bit is 0, then a cell has wall in the direction.
		// cell bit & one of (8,4,2,1) = 0 if there is a wall.
		//                              > 0 if there is no wall.	
		
		if( (x1_cor == next_x1) && (y1_cor == next_y1) ){
			collision = 1;
			console.log("Here");
		}			
		else{
			console.log("There");
			if ((x1_cor == x2_cor) && (y1_cor == y2_cor)){
				collision = myApp.maze[0][x1_cor][y1_cor] & wall[myApp.currentDirection];
				console.log(myApp.maze[0][x1_cor][y1_cor]+ " " +myApp.currentDirection);				
				console.log(collision);					
				console.log(x1_cor + " " + y1_cor + " " + x2_cor + " "+ y2_cor);			
			}			
			else{
				console.log(x1_cor + " " + y1_cor + " " + x2_cor + " "+ y2_cor);	
				collision = myApp.maze[0][x1_cor][y1_cor] & wall[myApp.currentDirection];
				if (collision > 0)		
					collision = myApp.maze[0][x2_cor][y2_cor] & wall[myApp.currentDirection];
			}
		}
	}

	return (collision == 0)? false:true;	
}
