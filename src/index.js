import Game from "./game.js";
import {} from "./fpsmeter.js";

let canvas = document.getElementById("gameScreen");
canvas.setAttribute(
  "style",
  "position: absolute;left: 50%;margin-left:-400px; top: 20%;margin-top:-100px; border:2px solid white"
);
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 640;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
//game.execAIroutine(500);
// game.setFireLimit(200);

let lastTime = 0;

let fpsmeter = new FPSMeter({
  decimals: 0,
  graph: true,
  theme: "dark",
  left: "5px"
});

let engine = {
  start: function(interval_) {
    /* The accumulated_time is how much time has passed between the last logic update and the most recent call to render. */
    var accumulated_time = interval_;
    /* The current time is the current time of the most recent call to render. */
    var current_time = undefined;
    /* The amount of time between the second most recent call to render and the most recent call to render. */
    var elapsed_time = undefined;
    /* You need a reference to this in order to keep track of timeout and requestAnimationFrame ids inside the loop. */
    var handle = this;
    /* The last time render was called, as in the time that the second most recent call to render was made. */
    var last_time = Date.now();

    /* Here are the functions to be looped. */
    /* They loop by setting up callbacks to themselves inside their own execution, thus creating a string of endless callbacks unless intentionally stopped. */
    /* Each function is defined and called immediately using those fancy parenthesis. This keeps the functions totally private. Any scope above them won't know they exist! */
    /* You want to call the logic function first so the drawing function will have something to work with. */

    (function logic() {
      /* Set up the next callback to logic to perpetuate the loop! */
      handle.timeout = window.setTimeout(logic, interval_);

      /* This is all pretty much just used to add onto the accumulated time since the last update. */
      current_time = Date.now();
      /* Really, I don't even need an elapsed time variable. I could just add the computation right onto accumulated time and save some allocation. */
      elapsed_time = current_time - last_time;
      last_time = current_time;

      accumulated_time += elapsed_time;

      /* Now you want to update once for every time interval_ can fit into accumulated_time. */
      while (accumulated_time >= interval_) {
        /* Update the logic!!!!!!!!!!!!!!!! */
        //red_square.update();

        //game.tank.maxSpeed

        //game.collision.check(1);

        //game.setFireLimit(200);
        //game.execAIroutine(500);
        accumulated_time -= interval_;
      }
    })();
  }
};

//var stop = false;
// var frameCount = 0;
// var $results = $("#results");
//var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

// function startAnimating(fps) {
//   fpsInterval = 1000 / fps;
//   then = Date.now();
//   startTime = then;
//   animate();
// }

// function animate() {
//   // request another frame

//   requestAnimationFrame(animate);

//   // calc elapsed time since last loop

//   now = Date.now();
//   elapsed = now - then;

//   // if enough time has elapsed, draw the next frame

//   if (elapsed > fpsInterval) {
//     // Get ready for next frame by setting then=now, but also adjust for your
//     // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
//     then = now - (elapsed % fpsInterval);

//     // Put your drawing code here
//     ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

//     game.update(fpsInterval);
//     game.draw(ctx);

//     fpsmeter.tickStart();
//     fpsmeter.tick();
//   }
// }

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  //let deltaTime = 1;
  lastTime = timestamp;

  //ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);
  game.draw(ctx);

  fpsmeter.tickStart();
  fpsmeter.tick();
  requestAnimationFrame(gameLoop);

  // } else {
  //   cancelAnimationFrame(requestID);

  //   switch (game.gamestate) {
  //     case 0:
  //       game.pauseScreen();
  //       break;
  //     case 2:
  //       game.menuScreen();
  //       break;
  //     case 3:
  //       game.gameoverScreen();
  //       break;
  //     case 5:
  //       game.winScreen();
  //       break;
  //   }
  // }
}

//engine.start(100);
requestAnimationFrame(gameLoop);
//startAnimating(1000000000000000000000000000000000);
