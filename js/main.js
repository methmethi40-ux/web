let animals = [];
let page = 1;
const perPage = 6;

const grid = document.getElementById("animal-grid");
const search = document.getElementById("search");
const pageInfo = document.getElementById("page-info");

Promise.all([
  fetch("data/animals-001.json").then(r => r.json()),
  fetch("data/animals-002.json").then(r => r.json())
]).then(data => {
  animals = data.flat();
  render();
});

function render() {
  grid.innerHTML = "";
  const term = search.value.toLowerCase();

  const filtered = animals.filter(a =>
    a.name.toLowerCase().includes(term)
  );

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  paginated.forEach(a => {
    const card = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `
      <img src="${a.image}">
      <h3>${a.name}</h3>
      <p>${a.region}</p>
    `;
    card.onclick = () => {
      window.location.href =
        `animal-pages/animal.html?animal=${a.id}`;
    };
    grid.appendChild(card);
  });

  pageInfo.textContent = `Page ${page}`;
}

search.oninput = () => {
  page = 1;
  render();
};

document.getElementById("next").onclick = () => {
  page++;
  render();
};

document.getElementById("prev").onclick = () => {
  if (page > 1) page--;
  render();
};
