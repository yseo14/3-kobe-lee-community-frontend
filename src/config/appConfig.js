export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080" // 로컬 개발 환경 (백엔드 포트)
    : ""; // ★ 배포 환경: 빈 문자열 (상대 경로 사용)

// S3 버킷 설정
export const S3_BUCKET_NAME = "community-resources-bucket";
export const S3_REGION = "ap-northeast-2";

// S3 이미지 URL 생성 함수
export const getS3ImageUrl = (imageKey) => {
  if (!imageKey) return null;
  return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${imageKey}`;
};

