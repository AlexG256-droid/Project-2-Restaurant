import { request } from "./api.js";

const logoutButton = document.querySelector("#logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await request("/api/auth/logout", { method: "POST" });
    window.location.href = "/pages/login.html";
  });
}
