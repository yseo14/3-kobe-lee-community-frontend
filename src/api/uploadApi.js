import { getUploadApiUrl } from "../config/appConfig.js";

/**
 * 프로필 이미지 업로드 API
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<{ok: boolean, data: {status: number, message: string, data: Array<{objectKey: string}>}}>}
 */
export async function uploadProfileImage(file) {
  const UPLOAD_URL = getUploadApiUrl("profile");

  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("[uploadApi] 이미지 업로드 요청 시작:", file.name);
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    console.log("[uploadApi] 응답 상태:", response.status, response.ok);
    const data = await response.json();
    console.log("[uploadApi] 응답 데이터:", data);

    return { ok: response.ok, data };
  } catch (err) {
    console.error("[uploadApi] 이미지 업로드 실패:", err);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}

/**
 * 게시글 이미지 업로드 API
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<{ok: boolean, data: {status: number, message: string, data: Array<{objectKey: string}>}}>}
 */
export async function uploadPostImage(file) {
  const UPLOAD_URL = getUploadApiUrl("post");

  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("[uploadApi] 게시글 이미지 업로드 요청 시작:", file.name);
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    console.log("[uploadApi] 응답 상태:", response.status, response.ok);
    const data = await response.json();
    console.log("[uploadApi] 응답 데이터:", data);

    return { ok: response.ok, data };
  } catch (err) {
    console.error("[uploadApi] 게시글 이미지 업로드 실패:", err);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}

