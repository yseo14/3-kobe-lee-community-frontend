export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080" // 개발 중에 로컬 서버로 연결
    : "http://13.125.4.68:8080"; // 배포시 배포 서버로 연결
