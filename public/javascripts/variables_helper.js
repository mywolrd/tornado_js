
// Initialize variables
function initVariables(){
    
    myApp.stage[0] = new Kinetic.Stage({
        container: 'game',
        width: 1000, height: 500
    });

    myApp.layer.game = new Kinetic.Layer();

    myApp.myPlayer = new Kinetic.Sprite({
        x:myApp.x,y:myApp.y,
        image:myApp.myPlayerImage, animation:'idle',
        animations: myApp.sprite, frameRate: 6, index: 0
    });

	//PANEL LAYER 
    myApp.misc = new Kinetic.Stage({
        container: 'misc',
		width: 150, height: 50
    });

    myApp.layer.misc = new Kinetic.Layer();

    /*myApp.time = new Kinetic.Text({
        fill: 'black',
        align: 'center',
        x: 65, y: 2.5, width: 20,
        fontSize: 30, fontFamily: 'Calibri',
        text: '0'
    });*/
}
