function initStage(){

    myApp.myPlayerImage = new Image();
    myApp.myPlayerImage.src = $("#image1")[0].src

    myApp.myPlayerImage.onload = function(){

		myApp.myPlayer = new Kinetic.Sprite({
    		x:myApp.x,y:myApp.y,
        	image:myApp.myPlayerImage, animation:'right',
			animations: myApp.sprite, frameRate: 4, index: 0
	    });
		
		myApp.currentDirection = 3;
		
	    myApp.layer.game.add(myApp.myPlayer);       
		myApp.myPlayer.start();	
	}

	myApp.stage[myApp.id].add(myApp.layer.game);

    //myApp.layer.misc1.add(myApp.text.time);
    myApp.misc.add(myApp.layer.misc);
}

function initEnemyPlayer(index){

	var layer = myApp.stage[index].getChildren()[0]; 
	
	myApp.enemyPlayer[index] = new Kinetic.Rect({
		x: 1, y: 1, width:13, height:13,
		fill: 'black', stroke: 'black',strockWidth:1
	});

	layer.add(myApp.enemyPlayer[index]);

	myApp.stage[index].draw()
}

function updateEnemy(update){

	strs = update.split(' ');
	index = parseInt(strs[0], 10);
	locx = parseInt(strs[1], 10);
	locy = parseInt(strs[2], 10);

	myApp.enemyPlayer[index].setX(locx * 15 + 1);
	myApp.enemyPlayer[index].setY(locy * 15 + 1);
	myApp.stage[index].draw();
}

function update(){
	
	drawLimitedMaze();
}

function drawLimitedMaze(){

	var cur_x, cur_y, str_x, str_y, far_x, far_y;// current cell and boundary cells within  
                                   				 // player's vision   

	cur_x = getXindex(myApp.x);
    cur_y = getYindex(myApp.y);

	str_x = cur_x - 2;
    str_x = (str_x < 0) ? 0 : str_x;

    str_y = cur_y - 2;
    str_y = (str_y < 0) ? 0 : str_y;

    far_x = cur_x + 3;
    far_x = (far_x > myApp.mazesizew) ? myApp.mazesizew : far_x;

    far_y = cur_y + 3;
    far_y = (far_y > myApp.mazesizeh) ? myApp.mazesizeh : far_y;

	clear();
	drawMaze(myApp.stage[myApp.id], myApp.maze[myApp.id], str_x, str_y, far_x, far_y);
}

function getXindex(x){
	return Math.floor(x / myApp.mazecellw);
}

function getYindex(y){
	return Math.floor(y / myApp.mazecellh);
}

function clear(){

	var children = myApp.layer.game.getChildren();

	for(var i = 0 ; i < children.length; i++){
		if(children[i].getShapeType() == 'Line')
			children[i].destroy();
	}
}

function drawEntireMaze(stage, maze){

	drawMaze(stage, maze, 0,0,myApp.mazesizew, myApp.mazesizeh);
}

function drawMaze(stage, maze, str_x, str_y, far_x, far_y){

    var x1, x2, y1, y2;
	var size = (stage === myApp.stage[myApp.id])? 5 : 2; 
    var x = stage.getWidth() / myApp.mazesizew;
	var y = stage.getHeight() / myApp.mazesizeh;

	var layer = stage.getChildren()[0]; // safe because a stage will get only one layer.

	var getX= function(pos, i){
		return (pos == 0)? (x*i):x*(i+1);
	}

	var getY = function(pos, j){
		return (pos == 0)? (y*j):y*(j+1);
	}

	for(var i = str_x; i < far_x; i++){
        for(var j = str_y; j < far_y; j++){

            walls = getWalls(maze, i, j);
            if(walls != 0){
                //DRAW RIGHT WALL
    			if(i != myApp.mazesizew-1){
					if( (walls & 1) != 0 ){

		                x2 = getX(1,i);
		                y1 = getY(0,j);
		                y2 = getY(1,j);

		                var line = new Kinetic.Line({
		                    points: [x2, y1, x2, y2],    stroke: 'green',
		                    strokeWidth: size,    lineCap: 'square'
		                });
		                layer.add(line);
		            }
				}
                //DRAW BOTTOM WALL
				if(j != myApp.mazesizeh-1){
		            if( (walls & 2) != 0){
		                x1 = getX(0,i);
		                x2 = getX(1,i);
		                y2 = getY(1,j);

		                var line = new Kinetic.Line({
		                    points: [x1, y2, x2, y2],    stroke: 'green',
		                    strokeWidth: size,    lineCap: 'square'
		                });
		                layer.add(line);
		            }
				}	
	    	}
        }
    }
	stage.draw();
}

function getWalls(maze, x,y){
// returns 0 if (x, y) cell has no east, no south wall
//         1 if (x, y) cell has east, no south wall
//         2 if (x, y) cell has south wall, no east wall 
//         3 if (x, y) cell has east and south wall

	var wall = 0;

	if( (maze[x][y] & 1) == 0)
		wall = 1;

	if( (maze[x][y] & 4) == 0){
		if( wall == 1)
			wall = 3;
		else
			wall = 2;
	}
	return wall;
}

