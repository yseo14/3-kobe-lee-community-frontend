import { apiRequest } from "./api.js";

// 댓글 목록
export function fetchComments(
  postId,
  { sort = "latest", limit = 10, cursorId = null, cursorCreatedAt = null }
) {
  const params = new URLSearchParams({
    sort,
    limit,
  });

  if (cursorId) params.append("cursorId", cursorId);
  if (cursorCreatedAt) params.append("cursorCreatedAt", cursorCreatedAt);

  return apiRequest(`/post/${postId}/comment?${params.toString()}`, {
    method: "GET",
  });
}
