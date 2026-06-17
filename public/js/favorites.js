import { request, requireLogin } from "./api.js";
import "./nav.js";

await requireLogin();

const favoriteList = document.querySelector("#favorite-list");
const message = document.querySelector("#message");

async function loadFavorites() {
  const favorites = await request("/api/favorites");
  favoriteList.innerHTML = "";

  if (favorites.length === 0) {
    favoriteList.innerHTML = "<p>No favorite restaurants yet.</p>";
    return;
  }

  favorites.forEach((restaurant) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>${restaurant.name}</h3>
      <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
      <p><strong>Category:</strong> ${restaurant.category || "General"}</p>
      <p>${restaurant.notes || ""}</p>
      <button class="danger remove-button">Remove Favorite</button>
    `;

    card.querySelector(".remove-button").addEventListener("click", async () => {
      await request(`/api/favorites/${restaurant._id}`, { method: "DELETE" });
      message.textContent = "Favorite removed.";
      await loadFavorites();
    });

    favoriteList.appendChild(card);
  });
}

await loadFavorites();
