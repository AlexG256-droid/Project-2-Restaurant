import { request, requireLogin } from "./api.js";
import "./nav.js";

await requireLogin();

const pickButton = document.querySelector("#pick-button");
const result = document.querySelector("#result");

pickButton.addEventListener("click", async () => {
  try {
    const restaurant = await request("/api/restaurants/random/pick");

    result.innerHTML = `
      <article class="card">
        <h2>${restaurant.name}</h2>
        <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
        <p><strong>Price:</strong> ${restaurant.priceRange}</p>
        <p><strong>Location:</strong> ${restaurant.location || "N/A"}</p>
        <p><strong>Category:</strong> ${restaurant.category || "General"}</p>
        <p>${restaurant.notes || ""}</p>
      </article>
    `;
  } catch (error) {
    result.textContent = error.message;
  }
});
