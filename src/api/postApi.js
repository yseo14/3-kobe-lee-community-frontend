import { apiRequest } from "./api.js";

export function createPost(body) {
  return apiRequest("/post", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
