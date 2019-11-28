import AITank from "./aitank.js";

export default class AI {
  constructor(game) {
    this.tanks = [];
    this.game = game;
    this.routines = [];
  }

  buildRoutines() {
    this.routines[0] = ["D", "1", "L", "1", "U", "R"];
    this.routines[1] = ["R", "1", "U", "D", "1", "L"];
    this.routines[2] = ["R", "1", "R", "L", "-", "1", "U"];
    this.routines[3] = ["D", "1", "U", "1", "-", "-"];
    //this.routine(adt);
  }

  routine(adt) {
    let i = 0;
    this.tanks.forEach(tank => {
      tank.setRoutine(adt, this.routines[i]);
      i += 1;
    });
  }

  clear() {
    if (this.tanks !== undefined) this.tanks.splice(0, this.tanks.length);
  }

  buildOpps() {
    this.tanks.push(new AITank(this.game, 600, 100));
    this.tanks.push(new AITank(this.game, 100, 400));
    this.tanks.push(new AITank(this.game, 200, 60));
    this.tanks.push(new AITank(this.game, 650, 700));
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
