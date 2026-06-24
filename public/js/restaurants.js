let favorites = [];
let restaurants = [];
let searchQuery = "";
import { requireLogin } from "./api.js";

await requireLogin();

const container = document.getElementById("restaurant");

// Remove duplicate entries so each restaurant name appears only once.
function dedupeByName(list) {
  const seen = new Set();

  return list.filter((restaurant) => {
    const key = restaurant.name.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function loadFavorites() {
  try {
    const response = await fetch("/api/favorites");

    if (!response.ok) {
      throw new Error("Failed to load favorites");
    }

    favorites = await response.json();

  } catch (error) {
    console.error(error);
  }
}

// Load the list from the JSON file, then show it on the page.
async function loadRestaurants() {
  try {
    const response = await fetch("/api/restaurants");
    restaurants = dedupeByName(await response.json());
    renderRestaurants();
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Sorry, the restaurants could not be loaded.</p>`;
  }
}

// Is this restaurant already a favorite? (matched by name)
function isFavorite(name) {
  return favorites.some((fav) => fav.name === name);
}

// Keep only the restaurants whose name matches the current search text.
function getFilteredRestaurants() {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return restaurants;
  }

  return restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(query)
  );
}

// Render restaurants
function renderRestaurants() {
  container.innerHTML = "";

  const visible = getFilteredRestaurants();

  if (visible.length === 0) {
    container.innerHTML = `<p class="text-muted">No restaurants match your search.</p>`;
    return;
  }

  visible.forEach((restaurant) => {
    const favorited = isFavorite(restaurant.name);
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}"
             onerror="this.style.display='none'">
        <div class="card-body">
          <h5 class="card-title">${restaurant.name}</h5>
          <p class="card-text"><strong>Category:</strong> ${restaurant.category}</p>
        </div>
        <div class="card-footer bg-white">
          <button class="btn btn-sm ${favorited ? "btn-danger" : "btn-outline-danger"}"
                  data-name="${restaurant.name}">
            ${favorited ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// One click handler covers every button (event delegation).
container.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-name]");
  if (button) {
    toggleFavorite(button.dataset.name);
  }
});

// Toggle favorite status
async function toggleFavorite(name) {

  try {

    const restaurant =
      restaurants.find((r) => r.name === name);

    if (!restaurant) {
      return;
    }

    const favorited =
      favorites.some(
        (fav) => fav._id === restaurant._id
      );

    if (favorited) {

      await fetch(
        `/api/favorites/${restaurant._id}`,
        {
          method: "DELETE"
        }
      );

      favorites =
        favorites.filter(
          (fav) => fav._id !== restaurant._id
        );

    } else {

      await fetch(
        `/api/favorites/${restaurant._id}`,
        {
          method: "POST"
        }
      );

      favorites.push(restaurant);
    }

    renderRestaurants();

  } catch (error) {
    console.error(error);
  }
}

// Build a search box above the list and re-render as the user types.
function setupSearch() {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-4";
  wrapper.innerHTML = `
    <input id="restaurant-search" type="search" class="form-control"
           placeholder="Search restaurants by name..."
           aria-label="Search restaurants by name">
  `;
  container.insertAdjacentElement("beforebegin", wrapper);

  wrapper
    .querySelector("#restaurant-search")
    .addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderRestaurants();
    });
}

// Initial load
setupSearch();

await loadFavorites();
await loadRestaurants();

// Create Restaurant
const form = document.querySelector("#restaurant-form");

console.log("FORM =", form);

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("SUBMIT FIRED");

  try {
    const response = await fetch("/api/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: document.querySelector("#name").value.trim(),
        cuisine: document.querySelector("#cuisine").value.trim(),
        category: document.querySelector("#category").value.trim()
      })
    });

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to create restaurant");
    }

    form.reset();

    await loadRestaurants();

    alert("Restaurant added successfully!");

  } catch (error) {
    console.error("ERROR:", error);
    alert(error.message);
  }
});