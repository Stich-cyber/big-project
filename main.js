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
let hider = document.querySelector("#hider");
if (hider) {
  hider.addEventListener("click", () => {
    document.querySelector(".content").style.display = "none";
    let cards = document.querySelectorAll(".card-invis");
    for (card of cards) {
      card.style.display = "flex";
    }
  });
}
let cards = document.querySelectorAll(".card-invis");
for (card of cards) {
  card.addEventListener("click", () => {
    document.querySelector(".content").style.display = "block";
    for (let otherCard of cards) {
      otherCard.style.display = "none";
    }
  });
}
let dropdownSelect = document.getElementById("dropdownSelect");
let customInput = document.getElementById("search");
let deleteButtons = document.querySelectorAll(".delete");

dropdownSelect.addEventListener("change", () => {
  if (dropdownSelect.value === "Search") {
    customInput.style.display = "block";
  } else {
    customInput.style.display = "none";
  }
});
async function item() {
  try {
    let response = await fetch(
      "https://68297b406075e87073a695a6.mockapi.io/api/contact"
    );
    let data = await response.json();
    const wrapper = document.querySelector(".wrapper");
    data.forEach((item) => {
      let card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${item.img}" alt="Car Image" />
        <div class="info">
          <h2>${item.firstName}</h2>
          <p>${item.number}</p>
        </div>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;
      card.querySelector(".delete").addEventListener("click", () => {
        deleteFuction(item.id);
      });
      wrapper.append(card);
    });
  } catch (error) {
    console.error(error);
  }
}
item();
function postUser(firstName, number) {
  try {
    let res1 = fetch(
      "https://68297b406075e87073a695a6.mockapi.io/api/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          number: number,
        }),
      }
    );
    let data1 = res1.json();
  } catch (error) {
    console.log(error);
  }
}
let form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  postUser(inp1.value, inp2.value);
  inp1.value = "";
  inp2.value = "";
  document.querySelector(".wrapper").innerHTML = "";
  fetchCars();
  btn1.style.backgroundColor = "#d55a5a";
  console.error(error);
});
function deleteFuction(id) {
  fetch(`https://68297b406075e87073a695a6.mockapi.io/api/contact/${id}`, {
    method: "DELETE",
  })
    .then((response1) => {
      if (response1.ok == true) {
        const notyf = new Notyf({
          duration: 3000,
          ripple: true,
          position: { x: "right", y: "top" },
        });
        notyf.success("Deleted successfully");
      } else {
        const notyf = new Notyf({
          duration: 3000,
          ripple: true,
          position: { x: "right", y: "top" },
        });
        notyf.error("delete failed");
      }
    })
    .catch((error) => console.log(error));
}
