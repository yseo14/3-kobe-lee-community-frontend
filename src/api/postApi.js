import { apiRequest } from "./api.js";

export function createPost(body) {
  return apiRequest("/post", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * 게시글 목록 조회 API
 * 기본적으로 생성일자 기준 최신순으로 조회
 */
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

/**
 * 게시글 상세 조회 API
 * GET /post/{postId}
 */
export function fetchPostDetail(postId) {
  if (!postId) {
    console.error("postId가 없습니다.");
    return { ok: false, data: null };
  }

  return apiRequest(`/post/${postId}`, {
    method: "GET",
  });
}

/**
 * 게시글 수정 API
 * PATCH /post/{postId}
 */
export function updatePost(postId, body) {
  return apiRequest(`/post/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/**
 * 게시글 삭제 API
 * DELETE /post/{postId}
 */
export function deletePost(postId) {
  return apiRequest(`/post/${postId}`, {
    method: "DELETE"
  });
}