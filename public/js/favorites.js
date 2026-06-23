// Read the favorites that were saved on the Restaurants page.
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const container = document.getElementById("favorites-list");

function renderFavorites() {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `<p class="text-muted">No favorites yet. Add some from the Restaurants page!</p>`;
    return;
  }

  favorites.forEach((restaurant) => {
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
          <button class="btn btn-sm btn-danger" data-name="${restaurant.name}">
            Remove from Favorites
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// One handler for every Remove button.
container.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-name]");
  if (button) {
    removeFavorite(button.dataset.name);
  }
});

function removeFavorite(name) {
  favorites = favorites.filter((fav) => fav.name !== name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// Initial render
renderFavorites();

// This page was assisted by Claude AI