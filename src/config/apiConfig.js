export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080" // 로컬 개발 환경 (백엔드 포트)
    : ""; // ★ 배포 환경: 빈 문자열 (상대 경로 사용)
