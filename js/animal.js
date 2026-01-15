const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const title = document.getElementById("animal-title");
const image = document.getElementById("animal-image");
const description = document.getElementById("animal-description");

fetch(`data/details/${id}.json`)
  .then(res => res.json())
  .then(a => {
    title.textContent = a.name;
    image.src = a.image;
    description.textContent = a.description;
  });
