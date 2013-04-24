function initStage(){

    myApp.myPlayerImage = new Image();
    myApp.myPlayerImage.src = $("#image1")[0].src

    myApp.myPlayerImage.onload = function(){

        myApp.myPlayer = new Kinetic.Sprite({
            x:myApp.x,y:myApp.y,
            image:myApp.myPlayerImage, animation:'idle',
            animations: myApp.sprite, frameRate: 6, index: 0
        });
        myApp.layer.game.add(myApp.myPlayer);
        myApp.stage.game.add(myApp.layer.game);
        myApp.myPlayer.start();
    }

    myApp.layer.misc1.add(myApp.text.time);
    myApp.stage.misc.add(myApp.layer.misc1);

    drawEnemyMazes();
}

function drawEnemyMazes(){
    
    $('#enemy1').css('position', 'absolute');
    $('#enemy1').css('top', '50px');
    $('#enemy1').css('left', '1100px');
}

function drawMaze(){

    initStage();

    var getWalls = function(x,y){
        // returns 0 if (x, y) cell has no east, no south wall
        //         1 if (x, y) cell has east, no south wall 
        //         2 if (x, y) cell has south wall, no east wall 
        //         3 if (x, y) cell has east and south wall
	
        var wall = 0;
        
	if( (myApp.maze[i][j] & 1) == 0)
	    wall = 1;

        if( (myApp.maze[i][j] & 4) == 0){
            if( wall == 1)
                wall = 3;
            else
                wall = 2;
        }
        return wall;
    }

    x = myApp.stage.game.getWidth() / myApp.mazesizew;
    y = myApp.stage.game.getHeight() / myApp.mazesizeh;

    var getX = function(pos, i){
        return (pos == 0)? (x*i):x*(i+1);
    }

    var getY = function(pos, j){
        return (pos == 0)? (y*j):y*(j+1);
    }

    var x1, x2, y1, y2;
    var cur_x, cur_y, far_x, far_y; // current cell and boundary cells within  
                                    // player's vision   
    
    cur_x = Math.round(myApp.x / x);
    cur_y = Math.round(myApp.y / y);

    far_x = cur_x + 5;
    far_x = (far_x > myApp.mazesizew) ? myApp.mazesizew : far_x

    far_y = cur_y + 5;
    far_y = (far_y > myApp.mazesizeh) ? myApp.mazesizeh : far_y

    for(var i = cur_x; i < far_x; i++){
        for(var j = cur_y; j < far_y; j++){

            walls = getWalls(i, j);

            if(walls != 0){
                //DRAW RIGHT WALL    
		if( (walls & 1) != 0 ){

                    x2 = getX(1,i);
                    y1 = getY(0,j);
                    y2 = getY(1,j);

                    var line = new Kinetic.Line({
                        points: [x2, y1, x2, y2],    stroke: 'gold',
                        strokeWidth: 5,    lineCap: 'square'
                    });
                    myApp.layer.game.add(line);
                }

                //DRAW BOTTOM WALL
                if( (walls & 2) != 0){

                    x1 = getX(0,i);
                    x2 = getX(1,i);
                    y2 = getY(1,j);

                    var line = new Kinetic.Line({
                        points: [x1, y2, x2, y2],    stroke: 'gold',
                        strokeWidth: 5,    lineCap: 'square'
                    });
                    myApp.layer.game.add(line);
                }	
	    }
        }
    }
}

