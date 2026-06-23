import { request } from "./api.js";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#message");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      window.location.href = "/pages/restaurants.html";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
      await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      window.location.href = "/pages/restaurants.html";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}
