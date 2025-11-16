export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080" // 개발 중에 로컬 서버로 연결
    : "https://community-alb-1133986083.ap-northeast-2.elb.amazonaws.com"; // 배포시 배포 서버로 연결
