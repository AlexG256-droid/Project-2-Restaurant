import { request, requireLogin } from "./api.js";
import "./nav.js";

await requireLogin();

const restaurantForm = document.querySelector("#restaurant-form");
const restaurantList = document.querySelector("#restaurant-list");
const message = document.querySelector("#message");

async function loadRestaurants() {
  const restaurants = await request("/api/restaurants");
  restaurantList.innerHTML = "";

  restaurants.forEach((restaurant) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>${restaurant.name}</h3>
      <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
      <p><strong>Price:</strong> ${restaurant.priceRange}</p>
      <p><strong>Location:</strong> ${restaurant.location || "N/A"}</p>
      <p><strong>Category:</strong> ${restaurant.category || "General"}</p>
      <p>${restaurant.notes || ""}</p>
      <button class="success favorite-button">Add Favorite</button>
      <button class="danger delete-button">Delete</button>
    `;

    card.querySelector(".favorite-button").addEventListener("click", async () => {
      try {
        const result = await request(`/api/favorites/${restaurant._id}`, { method: "POST" });
        message.textContent = result.message;
      } catch (error) {
        message.textContent = error.message;
      }
    });

    card.querySelector(".delete-button").addEventListener("click", async () => {
      await request(`/api/restaurants/${restaurant._id}`, { method: "DELETE" });
      await loadRestaurants();
    });

    restaurantList.appendChild(card);
  });
}

restaurantForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(restaurantForm);

  const restaurant = {
    name: formData.get("name").trim(),
    cuisine: formData.get("cuisine").trim(),
    priceRange: formData.get("priceRange"),
    location: formData.get("location").trim(),
    category: formData.get("category").trim(),
    notes: formData.get("notes").trim()
  };

  try {
    await request("/api/restaurants", {
      method: "POST",
      body: JSON.stringify(restaurant)
    });

    restaurantForm.reset();
    message.textContent = "Restaurant added.";
    await loadRestaurants();
  } catch (error) {
    message.textContent = error.message;
  }
});

await loadRestaurants();
