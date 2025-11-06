import { apiRequest } from "/src/api/api.js";

export function login(body) {
  return apiRequest("/auth", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
