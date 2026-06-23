// Favorites are saved in the browser so they stay between visits.
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let restaurants = [];
let currentPick = null;

const container = document.getElementById("random-restaurant");
const pickButton = document.getElementById("pick-button");

// Load the list from the JSON file, then show a random pick.
async function loadRestaurants() {
  try {
    const response = await fetch("../restaurants.json");
    restaurants = await response.json();
    pickRandom();
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Sorry, the restaurants could not be loaded.</p>`;
  }
}

// Is this restaurant already a favorite? (matched by name)
function isFavorite(name) {
  return favorites.some((fav) => fav.name === name);
}

// Choose one random restaurant from the list and show it.
// Skips the one currently on screen so we never repeat twice in a row.
function pickRandom() {
  const choices =
    restaurants.length > 1
      ? restaurants.filter((r) => r.name !== currentPick?.name)
      : restaurants;
  currentPick = choices[Math.floor(Math.random() * choices.length)];
  renderRandom();
}

// Render the current random pick
function renderRandom() {
  container.innerHTML = "";

  if (!currentPick) {
    return;
  }

  const favorited = isFavorite(currentPick.name);
  const card = document.createElement("div");
  card.className = "col-md-6 col-lg-4";
  card.innerHTML = `
    <div class="card h-100">
      <img src="${currentPick.image}" class="card-img-top" alt="${currentPick.name}"
           onerror="this.style.display='none'">
      <div class="card-body">
        <h5 class="card-title">${currentPick.name}</h5>
        <p class="card-text"><strong>Category:</strong> ${currentPick.category}</p>
      </div>
      <div class="card-footer bg-white">
        <button class="btn btn-sm ${favorited ? "btn-danger" : "btn-outline-danger"}"
                data-name="${currentPick.name}">
          ${favorited ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>
    </div>
  `;
  container.appendChild(card);
}

// One click handler covers the favorite button (event delegation).
container.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-name]");
  if (button) {
    toggleFavorite(button.dataset.name);
  }
});

// The "Pick a Restaurant" button shows a new random restaurant.
if (pickButton) {
  pickButton.addEventListener("click", pickRandom);
}

// Toggle favorite status
function toggleFavorite(name) {
  const index = favorites.findIndex((fav) => fav.name === name);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    const restaurant = restaurants.find((r) => r.name === name);
    favorites.push(restaurant);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderRandom();
}

// Initial load
loadRestaurants();

// This page was assisted by Claude AI
