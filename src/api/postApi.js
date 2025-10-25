import { apiRequest } from "./api.js";

export function createPost(body) {
  return apiRequest("/post", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchPosts({
  sort = "latest",
  limit = 10,
  cursorId = null,
  cursorValue = null,
}) {
  const params = new URLSearchParams({
    sort,
    limit,
  });

  if (cursorId) params.append("cursorId", cursorId);
  if (cursorValue) params.append("cursorValue", cursorValue);

  return apiRequest(`/post?${params.toString()}`, {
    method: "GET",
  });
}
