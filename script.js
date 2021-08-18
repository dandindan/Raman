class Canvas {
  constructor(element, ctx, w, h) {
    this.element = element;
    this.ctx = ctx;
    this.width = w;
    this.height = h;

    this.interactive = false;
    this.playing = true;

    this.point = {
      value: 150,
      speed: 0.25,
      limit: 70,
      floor: 10,
      up: true,
      animating: false
    }

    this.multiplier = {
      value: 1,
      speed: 0.005,
      limit: 20,
      floor: 1,
      up: true,
      animating: true
    }


    this.center = {
      x: w / 2,
      y: h / 2,
      targetX: w / 2,
      targetY: h / 2,
      easing: 0.02,
    };

    this.radius = {
      val: h / 2.2,
      targetVal: h / 2.2,
      easing: 0.02,
    };

    document.body.addEventListener("click", this.click.bind(this));
    document.body.addEventListener("mousemove", this.move.bind(this));
    document.body.addEventListener("keyup", this.keyup.bind(this));

    this.hue = 160;
  }

  click(e) {
    this.interactive = !this.interactive;

    if (!this.interactive) {
      this.center.targetX = this.width / 2;
      this.center.targetY = this.height / 2;
      this.radius.targetVal = this.height / 2.2;

      this.element.classList.remove("interactive");
    } else {
      this.element.classList.add("interactive");
    }
  }

  move(e) {
    if (!this.interactive) {
      return;
    }

    const h3 = this.height / 3;

    this.center.targetX = e.pageX;
    this.center.targetY = Math.max(e.pageY, h3);

    this.radius.targetVal = h3 + e.pageY * 0.8;
  }

  keyup(e) {
    if (e.which != 32) {
      return;
    }

    this.playing = !this.playing;

    if (this.playing && this.drawLoop) {
      this.drawLoop();
    }
  }

  update() {
    this.clear();

    this.animate(this.point);
    this.animate(this.multiplier);
    this.ease(this.center);
    this.ease(this.radius);

    this.hue += 0.3;

    const h = this.hue % 360;

    this.ctx.fillStyle = "hsl(" + h + ",70%,20%)";
    this.ctx.strokeStyle = "hsla(" + h + ",80%,60%,0.2)";
    this.ctx.globalCompositeOperation = "lighter";
  }

  clear() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "rgba(0,0,0,0.1)";
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fill();
  }

  draw() {
    let radius = this.radius.val;

    const w2 = this.center.x,
      h2 = this.center.y;

    this.ctx.beginPath();
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "black";

    const points = this.point.value;
    const multiplier = this.multiplier.value;

    for (let p = 0; p < points; p++) {
      const t = (p / points) * Math.PI * 2;
      const t2 = ((p * multiplier) / points) * Math.PI * 2;
      const x = radius * Math.cos(t) + w2;
      const y = radius * Math.sin(t) + h2;
      const x2 = radius * Math.cos(t2) + w2;
      const y2 = radius * Math.sin(t2) + h2;

      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
    }

    this.ctx.arc(w2, h2, radius, 0, 2 * Math.PI);

    this.ctx.stroke();
    this.ctx.closePath();
  }

  animate(object) {
    if (!object.animating) {
      return;
    }

    if (object.up) {
      object.value += object.speed;
    } else {
      object.value -= object.speed;
    }

    if (object.value > object.limit) {
      object.up = false;
    } else if (object.value < object.floor) {
      object.up = true;
    }
  }

  ease(object) {
    if (object.val) {
      const dv = object.targetVal - object.val;
      object.val += dv * object.easing;

      return;
    }

    const dx = object.targetX - object.x;
    const dy = object.targetY - object.y;
    object.x += dx * object.easing;
    object.y += dy * object.easing;
  }

  random(from, to) {
    return from + Math.rand() * (to - from);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.center.targetX = w / 2;
    this.center.targetY = h / 2;

    this.radius.targetVal = h / 2.2;
  }
}

((_) => {
  const canvasElement = document.getElementById("canvas"),
    ctx = canvasElement.getContext("2d");

  let n = 1,
    wa = (canvasElement.width = window.innerWidth),
    ha = (canvasElement.height = window.innerHeight),
    w = wa / n,
    h = ha / n,
    density = 1;

  const canvas = new Canvas(canvasElement, ctx, w, h);

  function setup() {
    window.addEventListener("resize", resize);

    density =
      window.devicePixelRatio != undefined ? window.devicePixelRatio : 1.0;

    canvasElement.width = w * density;
    canvasElement.height = h * density;

    canvas.width = w;
    canvas.height = h;
    canvas.drawLoop = draw;

    ctx.scale(density, density);

    draw();
  }

  function draw() {
    canvas.update();
    canvas.draw();

    if (canvas.playing) {
      window.requestAnimationFrame(draw);
    }
  }

  function resize() {
    w = canvasElement.width = window.innerWidth;
    h = canvasElement.height = window.innerHeight;

    canvasElement.width = w * density;
    canvasElement.height = h * density;

    canvas.resize(w, h);

    ctx.scale(density, density);
  }

  setup();
})();
