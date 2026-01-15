let page = 1;
const perPage = 50; // show many cards per scroll
const grid = document.getElementById("animal-grid");
const search = document.getElementById("search");

const modal = document.getElementById("animal-modal");
const modalName = document.getElementById("modal-name");
const modalImg = document.getElementById("modal-img");
const modalBrief = document.getElementById("modal-brief");
const moreInfoBtn = document.getElementById("more-info-btn");
const closeModal = document.getElementById("close-modal");

async function fetchAnimals() {
  const res = await fetch("data/animals.json");
  return await res.json();
}

let animals = [];

fetchAnimals().then(data => {
  animals = data;
  render();
});

function render() {
  grid.innerHTML = "";
  const term = search.value.toLowerCase();
  const filtered = animals.filter(a => a.name.toLowerCase().includes(term));
  filtered.forEach(a => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `
      <img src="${a.image}" alt="${a.name}">
      <h3>${a.name}</h3>
      <p>${a.region}</p>
    `;
    card.onclick = () => openModal(a.id);
    grid.appendChild(card);
  });
}

search.oninput = render;

function openModal(id) {
  const a = animals.find(x => x.id===id);
  modalName.textContent = a.name;
  modalImg.src = a.image;
  modalBrief.textContent = a.brief;
  moreInfoBtn.href = `animal.html?id=${id}`;
  modal.style.display="flex";
}

closeModal.onclick = ()=> { modal.style.display="none"; };
window.onclick = e => { if(e.target===modal) modal.style.display="none"; };
