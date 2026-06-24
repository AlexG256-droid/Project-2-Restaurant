import { requireLogin } from "./api.js";

await requireLogin();

let favorites = [];

const container = document.getElementById("favorites-list");

// Load favorites from MongoDB Atlas
async function loadFavorites() {
  try {
    const response = await fetch("/api/favorites");

    if (!response.ok) {
      throw new Error("Failed to load favorites");
    }

    favorites = await response.json();

    renderFavorites();

  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <p class="text-danger">
        Failed to load favorites.
      </p>
    `;
  }
}

function renderFavorites() {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `
      <p class="text-muted">
        No favorites yet. Add some from the Restaurants page!
      </p>
    `;
    return;
  }

  favorites.forEach((restaurant) => {

    const card = document.createElement("div");

    card.className = "col-md-6 col-lg-4";

    card.innerHTML = `
      <div class="card h-100">

        <img
          src="${restaurant.image || ""}"
          class="card-img-top"
          alt="${restaurant.name}"
          onerror="this.style.display='none'"
        >

        <div class="card-body">
          <h5 class="card-title">
            ${restaurant.name}
          </h5>

          <p class="card-text">
            <strong>Category:</strong>
            ${restaurant.category || "General"}
          </p>

          <p class="card-text">
            <strong>Cuisine:</strong>
            ${restaurant.cuisine || "N/A"}
          </p>
        </div>

        <div class="card-footer bg-white">
          <button
            class="btn btn-sm btn-danger"
            data-id="${restaurant._id}"
          >
            Remove from Favorites
          </button>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

// Remove favorite
async function removeFavorite(id) {
  try {

    const response = await fetch(
      `/api/favorites/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    await loadFavorites();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Event delegation
container?.addEventListener("click", async (event) => {

  const button =
    event.target.closest("button[data-id]");

  if (!button) {
    return;
  }

  await removeFavorite(button.dataset.id);
});

// Initial load
loadFavorites();