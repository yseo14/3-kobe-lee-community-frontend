import { apiRequest } from "/src/api/api.js";

export function login(body) {
  return apiRequest("/auth", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function logout() {
  return apiRequest("/auth", {
    method: "DELETE",
  });
}
