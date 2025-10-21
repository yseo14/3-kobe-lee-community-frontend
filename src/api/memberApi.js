import { apiRequest } from "./index.js";

export function signUp(body) {
  return apiRequest("/member", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// 회원정보 수정
export function updateMember(body) {
  return apiRequest("/member", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// 회원 탈퇴
export function deleteMember() {
  return apiRequest("/member", {
    method: "DELETE",
  });
}