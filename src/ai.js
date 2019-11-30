import AITank from "./aitank.js";
import { step, setSteps, callStepFunction } from "./step.js";
import { initConsole } from "./customConsole.js";

export default class AI {
  constructor(game) {
    this.qtable = [];
    this.tanks = [];
    this.game = game;
    this.steps = [];
    this.action = null;
    this.actions = ["U", "D", "R", "L", "1"];
    this.learningRate = 0.8;
    this.discount = 0.6;
    this.reward = null;
    this.newstate = null;
  }

  fillQtable()  {
    for(let i=0; i<16; i++) {
      for(let j=0; j<20; j++) {
        let subQtable = []
        for(let i=0; i<16; i++) {
          for(let j=0 ; j<20; j++) {
            subQtable.push([Math.random(),Math.random(),Math.random(),Math.random()])
          }
        }
        this.qtable.push(subQtable)
      }
    }
    console.log(this.qtable)
  }



  positionToIndex(arr) {
    arr[0] = arr[0]/40
    arr[1] = arr[1]/40
    return arr
  }

  getQ(currState)  {
    let arr1 = this.positionToIndex(currState[0]);
    let arr2 = this.positionToIndex(currState[1]);
    let qarr = this.qtable[(arr1[0])*20+arr1[1]][(arr2[0])*20+arr2[1]];
    let Qval = Math.max(...qarr);
    let indexOfQ = qarr.indexOf(Qval);
    return([Qval, indexOfQ]);
  }

  randomAction(tank) {
    if (this.game.gamestate === 1)
      this.action = this.actions[Math.floor(Math.random() * 5)];
    else this.action = "pause";
    //console.log(this.action);
    step(tank, this.action);
  }


  initializeRandomAI(adt) {
    
    this.tanks.forEach(tank => {
      setInterval(() => {
        this.qlogic();
      }, adt);
    });
  }

  qlogic()  {
    
    let currState = this.game.currentState();
    let currQ = this.getQ(currState);
    this.action = currQ[1]
    let somedata = this.tanks[0].step(this.action); ///only for FIRST TANK
    this.reward = somedata[0];
    this.newState = somedata[1];
    let maxNextQ = this.getQ(this.newState)
    let newQ = (1-this.learningRate)*currQ + this.learningRate*(this.reward + this.discount*maxNextQ) 
    let arr1 = this.positionToIndex(currState[0]);
    let arr2 = this.positionToIndex(currState[1]);
    console.log(currState)
    //this.qtable[(arr1[0])*20+arr1[1]][(arr2[0])*20+arr2[1]] = newQ
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

  buildOpponents() {
    this.tanks.push(new AITank(this.game, 385, 30));
    this.tanks.push(new AITank(this.game, 100, 400));
    this.tanks.push(new AITank(this.game, 200, 40));
    this.tanks.push(new AITank(this.game, 150, 400));
    this.tanks.push(new AITank(this.game, 500, 550));
    this.tanks.push(new AITank(this.game, 700, 500));
    //this.tanks.push(new AITank(this.game, 650, 700));
    //console.log(this.tanks);

    initConsole(this);

    this.setTankIndexes();
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
