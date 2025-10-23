import { BASE_URL } from "../config/apiConfig.js";

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const token = sessionStorage.getItem("accessToken");

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

    // access token 만료 시 재발급 시도
    if (response.status === 401) {
      console.warn("Access Token이 만료되었습니다. 재발급 요청을 시도합니다.");
      const refreshed = await tryRefreshToken();

      if (refreshed) {
        // 새 access token으로 다시 요청
        const newAccessToken = sessionStorage.getItem("accessToken");
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...mergedHeaders,
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: options.credentials ?? "include",
        });

        const retryData = await retryResponse.json();
        return { ok: retryResponse.ok, data: retryData };
      } else {
        throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
      }
    }

    const data = await response.json();

    return { ok: response.ok, data };
  } catch (err) {
    console.error(`API 요청 실패: ${url}`, err);
    throw new Error("서버와 연결할 수 없습니다.");
  }
}

async function tryRefreshToken() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // HttpOnly 쿠키 전송 필수
    });

    if (!res.ok) {
      console.warn("Refresh token invalid or expired.");
      sessionStorage.removeItem("accessToken");
      return false;
    }

    const data = await res.json();
    const newAccessToken = data.result.accessToken;

    if (!newAccessToken) {
      console.error("Refresh 응답에 accessToken이 없습니다.");
      return false;
    }

    sessionStorage.setItem("accessToken", newAccessToken);
    console.info("Access token successfully refreshed.");
    return true;
  } catch (err) {
    console.error("Access token 재발급 실패:", err);
    return false;
  }
}
