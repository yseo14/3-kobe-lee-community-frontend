import { apiRequest } from "/src/api/api.js";

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

export function createComment(postId, content) {
  return apiRequest(`/post/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: { "Content-Type": "application/json" },
  });
}

export function deleteComment(postId, commentId) {
  return apiRequest(`/post/${postId}/comment/${commentId}`, {
    method: "DELETE",
  });
}

// 댓글 수정 
export function updateComment(postId, commentId, content) {
  return apiRequest(`/post/${postId}/comment/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}