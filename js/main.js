let allAnimals = [];
let filtered = [];
let page = 0;
const perPage = 6;
const files = ["animals-001.json", "animals-002.json"];

// LOAD DATA
Promise.all(files.map(f => fetch(`data/${f}`).then(r=>r.json())))
  .then(data => {
    allAnimals = data.flat();
    filtered = allAnimals;
    render();
  });

function render(){
  const grid = document.getElementById("animalGrid");
  grid.innerHTML = "";

  const start = page * perPage;
  const end = start + perPage;

  filtered.slice(start,end).forEach(a=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${a.image}">
        <div class="card-content">
          <h3>${a.name}</h3>
          <p>${a.region} • ${a.diet}</p>
          <button onclick="openAnimal('${a.id}')">More Info</button>
        </div>
      </div>
    `;
  });

  document.getElementById("pageText").innerText =
    `Page ${page+1} / ${Math.ceil(filtered.length/perPage)}`;
}

function nextPage(){ page++; render(); }
function prevPage(){ if(page>0){ page--; render(); } }

function searchAnimals(v){
  v = v.toLowerCase();
  filtered = allAnimals.filter(a=>a.search.includes(v));
  page = 0;
  render();
}

function openAnimal(id){
  window.location.href = `animal-pages/animal.html?id=${id}`;
}
