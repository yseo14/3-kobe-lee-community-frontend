import { apiRequest } from "./api.js";

export function signUp(body) {
  return apiRequest("/member", {
    method: "POST",
    credentials: "omit", //  회원가입은 요청 및 응답에 쿠키 필요 없음. 
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

export function getMyInfo(){
  return apiRequest("/member", {
    method: "GET",
  });
}