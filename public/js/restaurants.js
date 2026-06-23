// Favorites are saved in the browser so they stay between visits.
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let restaurants = [];
let searchQuery = "";

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

// Load the list from the JSON file, then show it on the page.
async function loadRestaurants() {
  try {
    const response = await fetch("../restaurants.json");
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
function toggleFavorite(name) {
  const index = favorites.findIndex((fav) => fav.name === name);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    const restaurant = restaurants.find((r) => r.name === name);
    favorites.push(restaurant);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderRestaurants();
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
loadRestaurants();

// This page was assisted by Claude AI