export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080" // 개발 중에 로컬 서버로 연결
    : "https://api.myservice.com"; // 배포시 배포 서버로 연결
