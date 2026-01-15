let animals = [];
let page = 1;
const perPage = 12;

const grid = document.getElementById("animal-grid");
const search = document.getElementById("search");
const pageInfo = document.getElementById("page-info");

const modal = document.getElementById("animal-modal");
const modalName = document.getElementById("modal-name");
const modalImg = document.getElementById("modal-img");
const modalDesc = document.getElementById("modal-desc");
const closeModal = document.getElementById("close-modal");

const files = ["data/animals-001.json", "data/animals-002.json"];

// Load JSON data
Promise.all(files.map(f => fetch(f).then(r => r.json())))
  .then(data => {
    animals = data.flat();
    render();
  })
  .catch(err => console.error("Error loading data:", err));

// Render cards
function render() {
  grid.innerHTML = "";
  const term = search.value.toLowerCase();
  const filtered = animals.filter(a => a.name.toLowerCase().includes(term));
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  paginated.forEach(a => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `
      <img src="${a.image}" alt="${a.name}">
      <h3>${a.name}</h3>
      <p>${a.region}</p>
      <button onclick="openAnimal('${a.id}')">More Info</button>
    `;
    grid.appendChild(card);
  });

  pageInfo.textContent = `Page ${page} of ${Math.ceil(filtered.length/perPage)}`;
}

// Pagination
document.getElementById("next").onclick = () => { page++; render(); };
document.getElementById("prev").onclick = () => { if(page>1) page--; render(); };

// Search
search.oninput = () => { page = 1; render(); };

// Open animal modal
function openAnimal(id) {
  fetch(`/robot-verse/data/details/${id}.json`)
    .then(r => r.json())
    .then(d => {
      modalName.textContent = d.name;
      modalImg.src = d.image;
      modalDesc.textContent = d.description;
      modal.style.display = "flex";
    })
    .catch(err => alert("Animal details not found."));
}

// Close modal
closeModal.onclick = () => { modal.style.display = "none"; };
window.onclick = e => { if(e.target === modal) modal.style.display = "none"; };
