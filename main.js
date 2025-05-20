const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = [
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
let effectsEnabled = true;
let animationRunning = true;

window.addEventListener("mousemove", (event) => {
  if (!effectsEnabled) return;
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
  if (!effectsEnabled) {
    animationRunning = false;
    return;
  }
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

function toggle() {
  effectsEnabled = !effectsEnabled;
  let offOnButton = document.getElementById("off-on");

  if (effectsEnabled) {
    offOnButton.textContent = "Off effects";
    if (!animationRunning) {
      animationRunning = true;
      animate();
    }
  } else {
    offOnButton.textContent = "On effects";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = [];
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!effectsEnabled) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
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

document.getElementById("hider").addEventListener("click", () => {
  document.querySelector(".content").style.display = "none";
  document.querySelector(".card-invis").style.display = "block";
});

document.querySelector(".invis").addEventListener("click", () => {
  document.querySelector(".content").style.display = "block";
  document.querySelector(".card-invis").style.display = "none";
});

async function fetchContacts() {
  try {
    let response = await fetch(
      "https://68297b406075e87073a695a6.mockapi.io/api/contact"
    );
    let data = await response.json();
    renderContacts(data);
  } catch (error) {
    console.error(error);
    showNotification("Failed to load contacts", "error");
  }
}

function renderContacts(contacts) {
  let wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  contacts.map((contact) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${contact.img}" alt="Contact Image" />
      <div class="info">
        <h2>${contact.firstName}</h2>
        <p>${contact.number}</p>
      </div>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    card.querySelector(".delete").addEventListener("click", () => {
      deleteContact(contact.id);
    });
    card.querySelector(".edit").addEventListener("click", () => {
      enterEdit(contact);
    });
    wrapper.append(card);
  });
}

function enterEdit(contact) {
  inp1.value = contact.firstName;
  inp2.value = contact.number;
  btn1.textContent = "Update Contact";
  btn1.addEventListener("click", (e) => {
    e.preventDefault();
    editContact(contact.id, inp1.value, inp2.value);
    resetForm();
  });
}

function resetForm() {
  inp1.value = "";
  inp2.value = "";
  btn1.textContent = "Add Contact";
  btn1.style.backgroundColor = "#d55a5a";
}

async function postContact(firstName, number) {
  try {
    let response = await fetch(
      "https://68297b406075e87073a695a6.mockapi.io/api/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          number,
        }),
      }
    );

    if (response.ok) {
      showNotification("Contact added successfully", "success");
      fetchContacts();
    } else {
      showNotification("Failed to add contact", "error");
    }
  } catch (error) {
    console.error(error);
    showNotification("Error adding contact", "error");
  }
}

async function editContact(id, name, number) {
  try {
    const res = await fetch(
      `https://68297b406075e87073a695a6.mockapi.io/api/contact/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: name,
          number: number,
        }),
      }
    );
    showNotification("Contact updated successfully", "success");
    fetchContacts();
  } catch (error) {
    console.error(error);
    showNotification("Error updating contact", "error");
  }
}

async function deleteContact(id) {
  try {
    let response = await fetch(
      `https://68297b406075e87073a695a6.mockapi.io/api/contact/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      showNotification("Contact deleted successfully", "success");
      fetchContacts();
    } else {
      showNotification("Failed to delete contact", "error");
    }
  } catch (error) {
    console.error(error);
    showNotification("Error deleting contact", "error");
  }
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  await postContact(inp1.value, inp2.value);
  resetForm();
});

document.getElementById("search").addEventListener("input", (e) => {
  let searchTerm = e.target.value.toLowerCase();
  let cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    let name = card.querySelector("h2").textContent.toLowerCase();
    let number = card.querySelector("p").textContent.toLowerCase();

    if (name.includes(searchTerm) || number.includes(searchTerm)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});

document
  .getElementById("dropdownSelect")
  .addEventListener("change", async (e) => {
    let sortValue = e.target.value;
    try {
      let response = await fetch(
        "https://68297b406075e87073a695a6.mockapi.io/api/contact"
      );
      let contacts = await response.json();
      if (sortValue === "az") {
        contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
      } else if (sortValue === "za") {
        contacts.sort((a, b) => b.firstName.localeCompare(a.firstName));
      }
      renderContacts(contacts);
    } catch (error) {
      console.error(error);
      showNotification("Error sorting contacts", "error");
    }
  });

function showNotification(message, type) {
  const notyf = new Notyf({
    duration: 3000,
    ripple: true,
    position: { x: "right", y: "top" },
  });
  if (type === "success") {
    notyf.success(message);
  } else {
    notyf.error(message);
  }
}

fetchContacts();
