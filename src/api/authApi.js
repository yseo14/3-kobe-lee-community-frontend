import { apiRequest } from "./api.js";

export function login(body) {
  return apiRequest("/auth", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
