import { apiRequest } from "/src/api/api.js";

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

// 내 정보 조회
export function getMyInfo(){
  return apiRequest("/member", {
    method: "GET",
  });
}

// 이메일 중복 검사
export function checkEmailDuplicate(email) {
  return apiRequest(`/member/email?email=${encodeURIComponent(email)}`, {
    method: "GET",
  });
}

// 닉네임 중복 검사
export function checkNicknameDuplicate(nickname) {
  return apiRequest(`/member/nickname?nickname=${encodeURIComponent(nickname)}`, {
    method: "GET",
  });
}