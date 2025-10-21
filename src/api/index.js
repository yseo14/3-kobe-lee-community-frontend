import { BASE_URL } from "../config/api.js";

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (err) {
    console.error(`API 요청 실패: ${url}`, err);
    throw new Error("서버와 연결할 수 없습니다.");
  }
}
