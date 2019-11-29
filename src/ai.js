import AITank from "./aitank.js";

export default class AI {
  constructor(game) {
    this.tanks = [];
    this.game = game;
    this.steps = [];
    this.action = null;
    this.actions = ["U", "D", "R", "L", "1"];
  }

  randomAction(tank) {
    this.action = this.actions[Math.floor(Math.random() * 5)];
    //console.log(this.action);
    tank.step(this.action);
  }

  initializeRandomAI(adt) {
    this.tanks.forEach(tank => {
      setInterval(() => {
        this.randomAction(tank);
      }, adt);
    });
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
      tank.setSteps(adt, this.steps[i]);
      i += 1;
    });
  }

  clear() {
    if (this.tanks !== undefined) this.tanks.splice(0, this.tanks.length);
  }

  buildOpponents() {
    this.tanks.push(new AITank(this.game, 385, 30));
    //this.tanks.push(new AITank(this.game, 100, 400));
    //this.tanks.push(new AITank(this.game, 200, 60));
    //this.tanks.push(new AITank(this.game, 650, 700));
    //console.log(this.tanks);
  }

  removeEmpty() {
    this.tanks.forEach(tank => {
      if (tank.life === 0) {
        this.tanks[this.tanks.indexOf(tank)].routine = [];
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
