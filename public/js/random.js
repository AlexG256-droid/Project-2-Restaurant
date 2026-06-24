import { requireLogin } from "./api.js";

await requireLogin();

let favorites = [];
let restaurants = [];
let currentPick = null;

const container = document.getElementById("random-restaurant");
const pickButton = document.getElementById("pick-button");

// Load favorites instead of all restaurants
async function loadRestaurants() {

  try {

    const response =
      await fetch("/api/favorites");

    if (!response.ok) {
      throw new Error(
        "Failed to load favorites"
      );
    }

    restaurants =
      await response.json();

    favorites = restaurants;

    console.log(
      "FAVORITES =",
      restaurants
    );

    if (restaurants.length === 0) {

      container.innerHTML = `
        <p class="text-muted">
          No favorite restaurants found.
        </p>
      `;

      return;
    }

    pickRandom();

  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <p class="text-danger">
        Failed to load favorites.
      </p>
    `;
  }
}

// Is this restaurant already a favorite?
function isFavorite(name) {
  return favorites.some((fav) => fav.name === name);
}

// Pick a random favorite restaurant
function pickRandom() {
  if (restaurants.length === 0) {
    return;
  }

  const choices =
    restaurants.length > 1
      ? restaurants.filter((r) => r.name !== currentPick?.name)
      : restaurants;

  currentPick =
    choices[Math.floor(Math.random() * choices.length)];

  renderRandom();
}

// Render restaurant card
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
      <img
        src="${currentPick.image || ""}"
        class="card-img-top"
        alt="${currentPick.name}"
        onerror="this.style.display='none'"
      >

      <div class="card-body">
        <h5 class="card-title">${currentPick.name}</h5>

        <p class="card-text">
          <strong>Category:</strong>
          ${currentPick.category || "General"}
        </p>

        <p class="card-text">
          <strong>Cuisine:</strong>
          ${currentPick.cuisine || "N/A"}
        </p>
      </div>

      <div class="card-footer bg-white">
        <button
          class="btn btn-sm ${
            favorited
              ? "btn-danger"
              : "btn-outline-danger"
          }"
          data-name="${currentPick.name}"
        >
          ${
            favorited
              ? "Remove from Favorites"
              : "Add to Favorites"
          }
        </button>
      </div>
    </div>
  `;

  container.appendChild(card);
}

// Favorite button
container?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-name]");

  if (button) {
    toggleFavorite(button.dataset.name);
  }
});

// Pick button
pickButton?.addEventListener("click", () => {
  pickRandom();
});

// Toggle favorite
async function toggleFavorite(name) {

  const restaurant =
    restaurants.find(
      (r) => r.name === name
    );

  if (!restaurant) {
    return;
  }

  try {

    await fetch(
      `/api/favorites/${restaurant._id}`,
      {
        method: "DELETE"
      }
    );

    restaurants =
      restaurants.filter(
        (r) =>
          r._id !== restaurant._id
      );

    favorites = restaurants;

    if (restaurants.length === 0) {

      container.innerHTML = `
        <p class="text-muted">
          No favorite restaurants found.
        </p>
      `;

      return;
    }

    pickRandom();

  } catch (error) {
    console.error(error);
  }
}

// Initial load
loadRestaurants();