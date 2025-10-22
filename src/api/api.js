import { BASE_URL } from "../config/apiConfig.js";

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const token = sessionStorage.getItem("accessToken");
  console.log("현재 저장된 토큰:", token);

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
      credentials: options.credentials ?? "include",
    });

    const data = await response.json();

    return { ok: response.ok, data };
  } catch (err) {
    console.error(`API 요청 실패: ${url}`, err);
    throw new Error("서버와 연결할 수 없습니다.");
  }
}
