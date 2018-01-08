function init() {
    $('myCanvas').css({
        'left': '200px',
        'top': '200px'
    });
}

var moneys = [];
for(var i=0; i<10; i++) {
    var newMoney = {};
    newMoney.x = 30 + (i%4)*30;
    newMoney.y = 100 + Math.floor(i/5)*20 + Math.floor((Math.random()*100)+1);
    newMoney.width = 20;
    newMoney.height = 10;
    newMoney.maxHeight = 10;
    newMoney.draw = true;
    newMoney.marked = false;
    newMoney.angle = 0;
    newMoney.maxY = 200;
    newMoney.minY = 120;
    newMoney.rotateDirection = "left";
    newMoney.fallSpeed = Math.floor((Math.random()*1)+1);
    newMoney.flipSpeed = Math.floor((Math.random()*10)+5);
    newMoney.maxAngle = Math.random()/50;
    newMoney.moveType = "flip";
    moneys.push(newMoney);
}
for(var i=0; i<5; i++) {
    var newMoney = {};
    newMoney.x = 30 + (i%4)*30;
    newMoney.y = 100 + Math.floor(i/5)*20 + Math.floor((Math.random()*100)+1);
    newMoney.width = 20;
    newMoney.height = 10;
    newMoney.maxHeight = 10;
    newMoney.draw = true;
    newMoney.marked = false;
    newMoney.angle = 0;
    newMoney.maxY = 200;
    newMoney.minY = 120;
    newMoney.rotateDirection = "left";
    newMoney.fallSpeed = Math.floor((Math.random()*1)+1);
    newMoney.flipSpeed = Math.floor((Math.random()*10)+5);
    newMoney.maxAngle = Math.random()/15;
    newMoney.moveType = "flip";
    moneys.push(newMoney);
}
var t = 0;

function draw(canvas) {
    context = canvas.getContext("2d");
    t += 1;

    context.beginPath();
    
    for(var i=0; i<moneys.length; i++) {
        var money = moneys[i];
        if(money.draw) { context.rotate(money.angle*Math.PI);
            context.rect(money.x, money.y, money.width, money.height);
            context.rotate(-1*money.angle*Math.PI);
        }
    }
    context.fillStyle = "rgba(138, 168, 124, 1)";
    context.fill();
    context.closePath();
  
    // draw sun
    context.shadowColor = "rgba(255, 255, 0, 1)";
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2;
    context.beginPath();
    context.fillStyle = "rgba(255, 255, 0, 1)";
    context.arc(50, 80, 20, 0, 2*Math.PI, false);
    context.fill();
    context.closePath();
  
    context.beginPath();
    context.strokeStyle = "rgba(255, 255, 0, 1)";
    context.fillStyle = "rgba(255, 255, 0, 1)";
    context.moveTo(37, 57);
    context.lineTo(20, 20);
  
    context.moveTo(50, 55);
    context.lineTo(50, 30);
  
    context.moveTo(27, 67);
    context.lineTo(10, 55);
  
    context.moveTo(25, 80);
    context.lineTo(0, 80);
  
    context.moveTo(70, 60);
    context.lineTo(90, 40);

  
    context.stroke();
  
  
    context.closePath();
  
    context.fill();
    context.fillStyle = "white";
  


    context.beginPath();
    context.arc(100, 100, 25, 0, 2*Math.PI, false);
    context.arc(50, 105, 15, 0, 2*Math.PI, false);
    context.arc(20, 105, 20, 0, 2*Math.PI, false);
    context.arc(140, 105, 20, 0, 2*Math.PI, false);
    context.arc(75, 85, 20, 0, 2*Math.PI, false);
    context.arc(115, 85, 30, 0, 2*Math.PI, false);
    context.rect(20, 95, 120, 30);
    context.fillStyle = "white";
  

    context.shadowColor = "#555";
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2;
    context.fill();
    context.closePath();

  

  
};

function update() {
    var counter = 0;
    for(var i=0; i<moneys.length; i++) {

        var money = moneys[i];

        if(money.y < 300) {

            money.y += money.fallSpeed;
                money.angle = money.maxAngle*Math.sin(t/10);
                money.width
                money.height = money.maxHeight*Math.sin(t/money.flipSpeed);

        } else {
            money.y = money.minY;
            money.angle = 0;
            money.fallSpeed = Math.floor((Math.random()*1)+1);
            money.flipSpeed = Math.floor((Math.random()*10)+5);
            money.maxAngle = Math.random()/20;
    
        }
    }

};


function evaluate() {

};

function stop() {
    disableAnimation();
}

var requestId = 0;
var global = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    current: 0,
    draw: true
};

/* initialize canvas */
(function initCanvas() {
    var x = 3;
});

/**
* Set callback function for drawing.
*/
function setRefresh() {
    window.requestAnimationFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
        };
    })();
}

/**
* Disables animation callback.
* Call this after you're done animating.
*/
function disableAnimation() {
    global.draw = false;
}

/**
* Enable animation callback.
* Call this before you start animating.
*/
function enableAnimation() {
    global.draw = true;
}

/**
* Starts animation.
* (not sure where i'm using this to be honest.
*/
function start() {
    if(!requestId) {
        animate();
    }
}

/**
* Update function.
* Where the magic happens.
*/
function updateFunction(){
    update()
}

/**
* Clear frame for drawing.
*/
function clear() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
* Eval function, to decide what to do next.
* I'm using this to disable animation callback,
* so that I don't just draw when I don't need to.
*/
function eval() {
    // call check state
    evaluate();
};

/**
* Animate.
*/
function animate() {
    if(global.draw) {
        
        var canvas = document.getElementById("myCanvas");

        // update
        updateFunction();

        // clear
        clear();

        // draw
        draw(canvas);
 
        eval();
        requestId = window.requestAnimationFrame(animate);
    } else {

    }

}

$(function() {
    init();
    start();
});