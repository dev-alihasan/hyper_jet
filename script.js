const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const colors = ["#FDCA40", "#DF2935", "#3772FF", "#080708", "#23CE6B"];

let bounds;
let ratio;
let planeRotationAngle;
function init() {
  bounds = [window.innerWidth, window.innerHeight];

  canvas.width = bounds[0];
  canvas.height = bounds[1];

  ratio = bounds[0] / bounds[1];
  planeRotationAngle = Math.atan2(bounds[1] / 2, bounds[0] / 2);
}

// Plane
class Plane {
  constructor() {
    this.position = [bounds[0] / 2, bounds[1] / 2];
    this.size = [50, 100];
    this.width = (this.size[0] / 4) * 3;
    this.height = (this.size[1] / 3) * 2;
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.save();
    ctx.translate(this.position[0], this.position[1]);
    ctx.rotate(planeRotationAngle * ratio);
    ctx.beginPath();
    ctx.moveTo(-this.width, this.size[1] / 3);
    ctx.lineTo(0, -this.height);
    ctx.lineTo(this.width, this.size[1] / 3);
    ctx.lineTo(-this.size[0] / 2, this.size[1] / 3);
    ctx.fill();
    ctx.restore();
  }
}

// Lines
let state = {
  velocity: 1,
};
let shapes = [];
function createLine() {
  let line;
  line = shapes.find((el) => el.dead);
  if (!line) {
    line = {};
  }
  line = {
    dead: false,
    lat: random(1, 15),
    long: random(10, 200),
    position: [random(0, bounds[0]) + (bounds[0] / 3) * 2, -100],
    velocity: random(1, 4),
  };
  shapes.push(line);
}

function update() {
  for (let shape of shapes) {
    shape.position[0] -= shape.velocity * state.velocity * ratio;
    shape.position[1] += shape.velocity * state.velocity;
    if (shape.position[0] < bounds[0] && shape.position[1] > bounds[1]) {
      shape.dead = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, bounds[0], bounds[1]);
  ctx.fillStyle = "white";
  for (let shape of shapes) {
    if (!shape.dead) {
      ctx.save();
      ctx.translate(
        shape.position[0] + shape.long / 5,
        shape.position[1] + shape.lat / 5
      );
      ctx.rotate(-0.5);
      ctx.fillRect(-shape.long / 2, -shape.lat / 2, shape.long, shape.lat);
      ctx.restore();
    }
  }
  plane.draw();
}

const interval = 1000 / 60;
let then = Date.now();
let chance;
function loop() {
  requestAnimationFrame(loop);

  const now = Date.now();
  const delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    if (acc) {
      chance = 1;
    } else {
      chance = random(1, 4);
    }
    if (chance === 1) {
      createLine();
    }
    update();
    draw();
  }
}

init();
var plane = new Plane();
loop();

var acc = false;
let tween = null;
let planeTween = null;
document.addEventListener("mousedown", () => {
  acc = true;
  if (tween) {
    tween.kill();
  }
  tween = TweenLite.to(state, 0.5, { velocity: 25, ease: Linear.easeout });

  if (planeTween) {
    planeTween.kill();
  }
  planeTween = TweenLite.to(plane, 0.2, {
    width: plane.size[0] / 2,
    ease: Linear.easeout,
  });
  TweenLite.to(plane, 0.2, {
    height: (plane.size[1] / 4) * 3,
    ease: Linear.easeIn,
  });
});

document.addEventListener("mouseup", () => {
  acc = false;
  if (tween) {
    tween.kill();
  }
  tween = TweenLite.to(state, 0.2, { velocity: 1, ease: Linear.easeOut });

  if (planeTween) {
    planeTween.kill();
  }
  planeTween = TweenLite.to(plane, 0.2, {
    width: (plane.size[0] / 4) * 3,
    ease: Linear.easeOut,
  });
  TweenLite.to(plane, 0.2, {
    height: (plane.size[1] / 3) * 2,
    ease: Linear.easeOut,
  });
});

window.addEventListener("resize", () => {
  init();
  plane = new Plane();
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
