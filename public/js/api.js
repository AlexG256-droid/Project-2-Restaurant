export async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function getCurrentUser() {
  const data = await request("/api/auth/me");
  return data.user;
}

export async function requireLogin() {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "/pages/login.html";
  }

  return user;
}
