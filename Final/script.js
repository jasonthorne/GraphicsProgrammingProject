
//canvas layers and their context: 
var backgroundCanvas = document.getElementById("backgroundId");
var backgroundCtx = backgroundCanvas.getContext("2d");
var apple1Canvas = document.getElementById("apple1Id");
var apple1Ctx = apple1Canvas.getContext("2d"); 
var apple2Canvas = document.getElementById("apple2Id");
var apple2Ctx = apple2Canvas.getContext("2d"); 
var apple3Canvas = document.getElementById("apple3Id");
var apple3Ctx = apple3Canvas.getContext("2d"); 
var apple4Canvas = document.getElementById("apple4Id");
var apple4Ctx = apple4Canvas.getContext("2d"); 
var apple5Canvas = document.getElementById("apple5Id");
var apple5Ctx = apple5Canvas.getContext("2d"); 
var basketCanvas = document.getElementById("basketId");
var basketCtx = basketCanvas.getContext("2d"); 

var canvasW = backgroundCanvas.width; //canvas width
var canvasH = backgroundCanvas.height; //canvas height

//store appleLayer ctxs
var applesCtx = [apple1Ctx, apple2Ctx, apple3Ctx, apple4Ctx, apple5Ctx];

const MAX_APPLES = 5; //max apples
//======================================================

document.getElementById("timerId").innerHTML = 0; //set timer element //+++++++++++++++++++
//document.getElementById("scoreId").innerHTML = 0; //set hits element //+++++++++++++++++++

var backgroundImg = new Image(); //background image
backgroundImg.src = 'img/background.png'; //image source

var score = 0;

//----------------------------------------------------------------------------------------------------
//var appleX = [120, 273, 518, 632, 720]; 
//var appleY = [176, 132, 231, 119, 188];
/*
var testPic1 = new Image();
testPic1.src = 'img/apl1.png';
var testPic2 = new Image();
testPic2.src = 'img/apl2.png';
var testPic3 = new Image();
testPic3.src = 'img/apl3.png';
var testPic4 = new Image();
testPic4.src = 'img/apl4.png';
var testPic5 = new Image();
testPic5.src = 'img/apl5.png';
var testPicsArray = [testPic1, testPic2, testPic3, testPic4, testPic5];


var basketImg = new Image(); //basket image

//onload events:
backgroundImg.onload = function(){
    
    backgroundCtx.drawImage(backgroundImg, 0, 0, canvasW, canvasH);  //draw background
      
    basketImg.src = 'img/baskets/basket0.png'; //basket image source (assigned here so that background is drawn first)
    
    //load and draw basket:
    basketImg.onload = function(){
        //basketCtx.drawImage(basketImg, (canvasW - basketW) /2, (canvasH - basketH) - 10, basketW, basketH); 

        for (let i=0; i<5; i++){
            basketCtx.drawImage(testPicsArray[i], applesArray[i].xPos, applesArray[i].yPos, applesArray[i].width, applesArray[i].height); //draw Apple
            }
    }

    
    
}
*/

//----------------------------------------------------------------------------------------------------
//key event listeners:

var key = []; //for holding keycode values 
window.addEventListener("keydown", function(event){ //listens for key press, adds its keycode 
    key[event.keyCode] = true; 
});

window.addEventListener("keyup", function(event){ //listens for key release, removes its keycode
    key[event.keyCode] = false;
});

//----------------------------------------------------------------------------------------------------
//create basket:
var basketW = 110, basketH = basketW; //width & height of basket

var Basket = {
    img: (function(){ //basket image
       let img =  new Image();
       img.src = 'img/baskets/basket0.png';
        return img;
    }()),
    xPos: (canvasW - basketW) /2, //x pos of basket
    yPos: (canvasH - basketH) - 10, //y pos of basket
    width: basketW, //width of basket
    height: basketH, //height of basket
    move: function(){
        if (key[37]){ //if left is pressed
            this.xPos -=30; //decrease x pos 
            
            if(this.xPos <0){ //check for canvas collision
                this.xPos = 0; //stop at screen edge
            }
        }else if (key[39]){ //if right is pressed
            this.xPos += 30; //increase x pos
          
            if(this.xPos > (canvasW - this.width)){ //check for canvas collision
                this.xPos = canvasW - this.width; //stop at screen edge
            }
        }
       //ctx.drawImage(this.img, this.xPos, this.yPos, this.width, this.height); //draw moved basket ++++++++++++++++
    }
};

//----------------------------------------------------------------------------------------------------
//create apples:

var applesArray = []; //array for holding apples 
var appleX = [120, 273, 518, 632, 720]; //x pos of apples  
var appleY = [176, 132, 231, 119, 188]; //y pos of apples  
var appleSpeeds = [3, 6, 12]; //holds apple drop speeds
///////////var checkSpeed = 0;

//prototype function added to Array class, to allow random picking of elements:
Array.prototype.pickElement = function(){ 
    return this[Math.floor(Math.random()*this.length)]; //return a random element
}//https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array

Apple.prototype.fall = function(){

    this.yPos += this.speed; //drop apple
    this.speed += this.gravity; //add gravity to drop speed
    
    //check for collison with Basket:
    if (this.xPos < (Basket.xPos + Basket.width) && (this.xPos + this.width) > Basket.xPos
        && this.yPos < (Basket.yPos + Basket.height) && (this.yPos + this.height) > Basket.yPos
        && this.canScore){
        this.reset(); //reset apple
        score++; //add to score 
        console.log("collision speed: " + this.speed); //=================
        if (score < 8) {
          Basket.img.src='img/baskets/basket' + score.toString() + '.png'; 
        }
    }

    //check if apple has hit bottom of canvas:
    if(this.yPos >= ((canvasH - 10) - this.height)){  //'canvas height -10' to make level with basket
        //this.reset(); //reset apple
        this.canScore = false; //prevent scoring 
        this.yPos = (canvasH - 10) - this.height; //repostion at bottom of canvas
        this.speed *= -this.bounce; //bounce apple
    }

    if(this.speed == -0.05454545454545454){ //apple has stopped bouncing
        this.canFall = false; //prevent falling
    }
       
}          



function Apple(xPos, yPos){
    this.img = (function(){ //apple image
        let img =  new Image();
        img.src = 'img/apple.png';
        return img;
    }());
    this.xPos = xPos; //x pos of apple
    this.yPos = yPos; //y pos of apple
    this.width = 60; //width of apple
    this.height = 60; //height of apple
    this.gravity = 0.3; //gravity force
    this.bounce = 0.1; //bounce factor
    this.speed = appleSpeeds.pickElement(); //picks a speed
    this.canFall = true; //if apple can drop
    this.canScore = true; //if apple can score
    this.reset = function(){ 
        this.yPos = yPos; //reset y pos
        this.speed = appleSpeeds.pickElement(); //reset speed
        console.log("reset speed: " + this.speed) ///////////////////////////
        this.canScore = true; //reset ability to score
        this.canFall = true; //???????????????????????????????????????????
    };
    /*
    this.fall = function(){

    };
    */
}

//----------------------------------------------------------------------------------------------------
//animate game:

function animate(){ 

    drawBackground();
    drawBasket();
    drawApples();
    
    requestAnimationFrame(animate); //continue animation
}

function drawBackground(){
    backgroundCtx.clearRect(0, 0, canvasW, canvasH); //clear canvas
    backgroundCtx.drawImage(backgroundImg, 0, 0, canvasW, canvasH);  //draw background
}

function drawBasket(){
    basketCtx.clearRect(0, 0, canvasW, canvasH); //clear canvas
    Basket.move(); //move basket
    basketCtx.drawImage(Basket.img, Basket.xPos, Basket.yPos, Basket.width, Basket.height); //draw moved basket
 }

/*
function drawApple1(){
    apple1Ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    apple1Ctx.drawImage(applesArray[0].img, applesArray[0].xPos, applesArray[0].yPos, applesArray[0].width, applesArray[0].height); 
}
*/

function drawApples(){
    for (let i=0; i<applesArray.length; i++){
        ////////////console.log(applesArray[i].speed);
        if (applesArray[i].canFall == true){
            applesArray[i].fall(); //allow apple to fall
        }else{
            applesCtx[i].globalAlpha += -0.02; //fade opacity
            ////////////console.log("num:" +  applesCtx[i].globalAlpha);

            if(applesCtx[i].globalAlpha == 0.019999999999999383){ //when opacity is faded
                 //console.log("bum");
                 applesCtx[i].globalAlpha =1;
                 applesArray[i].reset(); //reset apple
            }   
        }
        applesCtx[i].clearRect(0, 0, canvasW, canvasH); //clear canvas
        applesCtx[i].drawImage(applesArray[i].img, applesArray[i].xPos, applesArray[i].yPos, applesArray[i].width, applesArray[i].height); 
    }
}


//----------------------------------------------------------------------------------------------------
//timer:

function Timer(time){
    this.time = time;
    this.countDown = function(){
        time--; //reduce time

    };
}

//----------------------------------------------------------------------------------------------------
//initialise the game:

//////var innit = (function(){

    //create and store Apples:  //++++++++++++++++++++INCREASE APPLE NUMBER
    for (let i=0; i<MAX_APPLES; i++){
      applesArray.push(new Apple(appleX[i], appleY[i], i)); //add Apple to array 
    }

    //=============================
    animate(); //=====================================
    //=============================


   

/////}());