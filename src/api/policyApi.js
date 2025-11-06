import { apiRequest } from "/src/api/api.js";

// 이용약관
export function getTerms() {
  return apiRequest("/terms", {
    method: "GET",
  });
}

// 개인정보처리방침
export function getPrivacy() {
  return apiRequest("/privacy", {
    method: "GET",
  });
}
