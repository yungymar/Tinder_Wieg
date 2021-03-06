'use strict';

var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');

function initCards(card, index) {
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });
  
  tinderContainer.classList.add('loaded');
}

initCards();

// allCards.forEach(function (el) {
//   var hammertime = new Hammer(el);

//   hammertime.on('pan', function (event) {
//     el.classList.add('moving');
//   });

//   hammertime.on('pan', function (event) {
//     if (event.deltaX === 0) return;
//     if (event.center.x === 0 && event.center.y === 0) return;

//     tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
//     tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

//     var xMulti = event.deltaX * 0.03;
//     var yMulti = event.deltaY / 80;
//     var rotate = xMulti * yMulti;

//     event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
//   });

//   hammertime.on('panend', function (event) {
//     el.classList.remove('moving');
//     tinderContainer.classList.remove('tinder_love');
//     tinderContainer.classList.remove('tinder_nope');

//     var moveOutWidth = document.body.clientWidth;
//     var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

//     event.target.classList.toggle('removed', !keep);

//     if (keep) {
//       event.target.style.transform = '';
//     } else {
//       var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
//       var toX = event.deltaX > 0 ? endX : -endX;
//       var endY = Math.abs(event.velocityY) * moveOutWidth;
//       var toY = event.deltaY > 0 ? endY : -endY;
//       var xMulti = event.deltaX * 0.03;
//       var yMulti = event.deltaY / 80;
//       var rotate = xMulti * yMulti;

//       event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
//       initCards();
//     }
//   });
// });

function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);




// p5 tracker


var xBaseBall1 = 0;
var yBaseBall1 = 0;

// trigger swipe
var ball1MaxThreshold = 300;
// reset swipe
var ball1MinThreshold = 100

var xBaseBall2 = 640;
var yBaseBall2 = 0;

// trigger swipe
var ball2MaxThreshold = 300;
// reset swipe
var ball2MinThreshold = 100;

//////////////////////


var distanceBall1 = 0;
var triggerLove = 0; 
var distanceBall2 = 0;
var triggerNope = 0; 

var cam;
var target = [];
var threshold = 25;


function setup() {

    var myCanvas = createCanvas(640, 480);
    myCanvas.parent("tracker");

    pixelDensity(1);
    cam = createCapture(cam);
    cam.hide();
    noStroke();

//    target = new TargetColor(color(255,0,0)); // Start off tracking for red
}

function draw() {
    background(0);
    image(cam, 0, 0);
    fill(0);
    noStroke();
    fill(255);
    text (threshold, 10, 10);
    	


    cam.loadPixels();
    console.log(threshold)

    // Before we begin searching, the world record for closest color is set to a high number that is easy for the first pixel to beat.
    var worldRecord = 500;

    // XY coordinate of closest color
    var closestX = 0;
    var closestY = 0;
    for (var i = 0; i < target.length; i++)   {
    for (var x = 0; x < cam.width; x += 3) {
    for (var y = 0; y < cam.height; y += 3) {
            var index = (x + (y * cam.width)) * 4;
            var redChannel = cam.pixels[index + 0];
            var greeChannel = cam.pixels[index + 1];
            var blueChannel = cam.pixels[index + 2];

            var d = dist(redChannel, greeChannel, blueChannel, target[i].red, target[i].green, target[i].blue);

            if (d < threshold) {
                worldRecord = d;
                target[i].avgX += x;
                target[i].avgY += y;
                target[i].count ++
            }
        }
    }



    if (target[i].count > 0) {
        // Draw a circle at the tracked pixel
        target[i].avgX = target[i].avgX/target[i].count
        target[i].avgY = target[i].avgY/target[i].count
     
        fill(target[i].rgb);
        strokeWeight(5);
        stroke(0);
        ellipse(target[i].avgX, target[i].avgY, 16, 16);
        text("id:"+i, target[i].avgX+10, target[i].avgY+10)   
    }

    // trigger love ball 1
    if(target[0]){
      distanceBall1 = dist(target[0].avgX,target[0].avgY,xBaseBall1,yBaseBall1);

      if ( distanceBall1 > ball1MaxThreshold && triggerLove == 0){
        triggerLove = 1;
        console.log("trigger love");
        document.getElementById("love").click();
      }

      if ( distanceBall1 < ball1MinThreshold && triggerLove == 1){
        triggerLove = 0;
      }
    }


    // trigger nope ball 2
    if(target[1]){
      distanceBall2 = dist(target[1].avgX,target[1].avgY,xBaseBall2,yBaseBall2);

      if ( distanceBall2 > ball2MaxThreshold && triggerNope == 0){
        triggerNope = 1;
        console.log("trigger nope");
        document.getElementById("nope").click();
      }

      if ( distanceBall2 < ball2MinThreshold && triggerNope == 1){
        triggerNope = 0;
      }
    }


    target[i].reset()
  }
}

function mousePressed() {
    target.push(new TargetColor(cam.get(mouseX, mouseY)));
}


function TargetColor(_color){     
   this.rgb = _color;
   this.red = red(_color);
   this.green = green(_color);
   this.blue = blue(_color);
   this.avgX = 0;
   this.avgY = 0;
   this.count = 0; 
   this.reset = function() {
       this.avgX = 0;
       this.avgY = 0;
       this.count = 0; 
   }
       
}

function keyTyped() {
    if(key == 'i') {
        threshold += 2.5
    }
    else if(key  == 'd') {
        threshold -= 2.5
        
    }
    else if( key == 'r'){
            target = []
    }
}






