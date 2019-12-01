import AITank from "./aitank.js";
import { step, setSteps, callStepFunction } from "./step.js";
import { initConsole } from "./customConsole.js";

export default class AI {
  constructor(game) {
    this.qTable = [];
    this.tanks = [];
    this.game = game;
    this.steps = [];
    this.action = null;
    this.actions = ["U", "D", "L", "R", "1"];
    this.learningRate = 0.8;
    this.discount = 0.6;
    this.reward = null;
    this.newState = null;
  }

  initializeAI(adt) {
    this.tanks.forEach(tank => {
      setInterval(() => {
        //this.randomAction(tank);
        this.qlogic(tank);
      }, adt);
    });
  }

  fillQtable() {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 20; j++) {
        let subQtable = [];
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 20; j++) {
            let actionsQvalues = [];
            this.actions.forEach(action => {
              actionsQvalues.push(Math.random());
            });
            subQtable.push(actionsQvalues);
          }
        }
        this.qTable.push(subQtable);
      }
    }
    console.log(this.qTable);
  }

  positionToIndex(positions) {
    // arr[0] = arr[0] / this.game.blockSize;
    // arr[1] = arr[1] / this.game.blockSize;

    let indexes = [];
    positions.forEach(elem => {
      indexes.push(elem / this.game.blockSize);
    });

    return indexes;
  }

  getQ(currState) {
    let arr1 = this.positionToIndex(currState[0]);
    let arr2 = this.positionToIndex(currState[1]);

    let tank = (arr1[1] * this.game.gameWidth) / this.game.blockSize + arr1[0];
    let bot = (arr2[1] * this.game.gameHeight) / this.game.blockSize + arr2[0];

    //console.log(tank, bot, arr1, arr2);

    let qArray = this.qTable[tank][bot];
    let qValue = Math.max(...qArray);
    return [qValue, qArray.indexOf(qValue)];
  }

  qlogic(aitank) {
    if (this.game.gamestate === 1) {
      let currState = this.game.currentState();
      let currQ = this.getQ(currState);
      this.action = currQ[1];

      let somedata = step(this.tanks[aitank.index], this.actions[this.action]); ///only for FIRST TANK

      this.reward = somedata[0];
      this.newState = somedata[1];
      let maxNextQ = this.getQ(this.newState);
      let newQ =
        (1 - this.learningRate) * currQ[0] +
        this.learningRate * (this.reward + this.discount * maxNextQ);
      let arr1 = this.positionToIndex(currState[0]);
      let arr2 = this.positionToIndex(currState[aitank.index + 1]);
      let tank =
        (arr1[1] * this.game.gameWidth) / this.game.blockSize + arr1[0];
      let bot =
        (arr2[1] * this.game.gameHeight) / this.game.blockSize + arr2[0];

      this.qTable[tank][bot][this.action] = newQ;
    }
  }

  randomAction(tank) {
    if (this.game.gamestate === 1)
      this.action = Math.floor(Math.random() * this.actions.length);
    else this.action = "pause";
    //console.log(this.action);
    step(tank, this.actions[this.action]);
  }

  buildOpponents() {
    this.clear();

    this.tanks.push(new AITank(this.game, 385, 30));
    // this.tanks.push(new AITank(this.game, 100, 400));
    // this.tanks.push(new AITank(this.game, 200, 40));
    // this.tanks.push(new AITank(this.game, 150, 400));
    // this.tanks.push(new AITank(this.game, 500, 550));
    // this.tanks.push(new AITank(this.game, 700, 500));
    // this.tanks.push(new AITank(this.game, 650, 700));
    //console.log(this.tanks);

    initConsole(this);

    this.setTankIndexes();
  }

  buildSteps() {
    this.steps[0] = ["D", "1", "L", "1", "U", "R"];
    // this.routines[1] = ["R", "1", "U", "D", "1", "L"];
    // this.routines[2] = ["R", "1", "R", "L", "-", "1", "U"];
    // this.routines[3] = ["D", "1", "U", "1", "-", "-"];
    //this.routine(adt);
  }

  runSteps(adt) {
    let i = 0;
    this.tanks.forEach(tank => {
      setSteps(tank, this.steps[i], adt);
      i += 1;
    });
  }

  clear() {
    if (this.tanks !== undefined) this.tanks.splice(0, this.tanks.length);
  }

  setTankIndexes() {
    this.tanks.forEach(tank => {
      tank.index = this.tanks.indexOf(tank);
    });
  }

  removeEmpty() {
    this.tanks.forEach(tank => {
      if (tank.life === 0) {
        //this.tanks[this.tanks.indexOf(tank)].routine = [];
        this.tanks.splice(this.tanks.indexOf(tank), 1);
      }
    });
  }

  draw(ctx) {
    this.tanks.forEach(tank => tank.draw(ctx));
  }

  update(ctx) {
    this.tanks.forEach(tank => tank.update(ctx));
  }
}
