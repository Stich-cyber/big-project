const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const colors = [
  "#white",
  "gray",
  "#343434",
  "#36454F",
  "#2a3439",
  "#353839",
  "#2F4F4F",
  "#242124",
  "#1B1B1B",
  "#1A1110",
  "#100C08",
  "#010B13",
  "#2D383A",
  "#3F3F46",
];
let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 80,
  isDown: false,
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  let count = mouse.isDown ? 15 : 5;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(true));
  }
});
window.addEventListener("mousedown", () => {
  mouse.isDown = true;
});
window.addEventListener("mouseup", () => {
  mouse.isDown = false;
});
class Particle {
  constructor(clicked = false) {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * (clicked ? 15 : 5);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.density = Math.random() * 30 + 5;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = clicked ? Math.random() * 5 + 2 : Math.random() * 2;
    this.velocityX = Math.cos(this.angle) * this.speed;
    this.velocityY = Math.sin(this.angle) * this.speed;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    if (this.size > 0.2) {
      this.size -= 0.15;
    }
    this.draw();
  }
}
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    if (particles[i].size <= 0.2) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
animate();
let btn1 = document.querySelector(".btn1");
let inp1 = document.querySelector(".inp1");
let inp2 = document.querySelector(".inp2");
function changeBtn1() {
  if (inp1.value.length >= 1 && inp2.value.length >= 1) {
    btn1.style.backgroundColor = "#5ad55a";
  } else {
    btn1.style.backgroundColor = "#d55a5a"; 
  }
}
inp1.addEventListener("input", changeBtn1);
inp2.addEventListener("input", changeBtn1);
changeBtn1();
