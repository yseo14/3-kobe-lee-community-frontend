import { apiRequest } from "./index.js";

export function signUp(body) {
  return apiRequest("/member", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
