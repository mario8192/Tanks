import { calculateReward } from "./calculateReward.js";
import { updateConsole } from "./customConsole.js";

//Step functions
export function step(bot, action) {
  if (action === "pause") {
    return;
  } else {
    if (action === "U") {
      bot.moveUp();
      //console.log("U");
    }
    if (action === "D") {
      bot.moveDown();
      //console.log("D");
    }
    if (action === "L") {
      bot.moveLeft();
      //console.log("L");
    }
    if (action === "R") {
      bot.moveRight();
      //console.log("R");
    }
    if (action === "-") {
      bot.stop();
      //console.log("-");
    }
    if (action === "1") {
      bot.shoot();
      //console.log("1");
    }

    bot.reward = calculateReward(bot);
    let array = bot.game.currentState();
    console.log(bot.reward, array);

    //custom console
    updateConsole(bot, array);
    return [bot.reward, bot.game.currentState()];
  }
}

export function setSteps(bot, steps, adt) {
  this.steps = steps;
  this.callStepFunction(adt);
}

export function callStepFunction(bot, adt) {
  let currentTask = 0;
  let game = this.game;
  setInterval(function() {
    //console.log(this);

    if (
      game.gamestate === 0 ||
      game.gamestate === 2 ||
      game.gamestate === 3 ||
      game.gamestate === 5
    )
      return;

    if (currentTask >= bot.steps.length) currentTask = 0;

    if (bot.steps[currentTask] == "U") {
      //bot.moveUp();
      //console.log("U");
      bot.step("U");
    }
    if (bot.steps[currentTask] == "D") {
      //bot.moveDown();
      //console.log("D");
      bot.step("D");
    }
    if (bot.steps[currentTask] == "L") {
      //bot.moveLeft();
      //console.log("L");
      bot.step("L");
    }
    if (bot.steps[currentTask] == "R") {
      //bot.moveRight();
      //console.log("R");
      bot.step("R");
    }
    if (bot.steps[currentTask] == "-") {
      //bot.stop();
      //console.log("-");
      bot.step("-");
    }
    if (bot.steps[currentTask] == "1") {
      //bot.shoot();
      //console.log("1");
      bot.step("1");
    }

    currentTask += 1;
  }, adt);
}
