import PostForm from "/src/components/post-form/Postform.js";
import { fetchPostDetail, updatePost } from "/src/api/postApi.js";
import { showToast } from "/src/utils/showToast.js";
import { navigate } from '/src/main.js';

export default function PostEditPage(postIdFromRoute) {
  const container = document.createElement("div");
  container.className = "post-edit-container";

  const postId =
    postIdFromRoute || window.location.hash.split("/").filter(Boolean)[1];

  if (!postId || isNaN(postId)) {
    container.innerHTML = `<p>잘못된 접근입니다.</p>`;
  }

  const loading = document.createElement("p");
  loading.textContent = "게시글 정보를 불러오는 중입니다...";
  container.appendChild(loading);

  (async () => {
    try {
      const { ok, data } = await fetchPostDetail(postId);
      if (!ok || !data.isSuccess) throw new Error("게시글 불러오기 실패");

      const post = data.result;

      const form = PostForm({
        mode: "edit",
        initialData: post,
        onSubmit: async (formData) => {
          console.log("게시글 수정 요청:", formData);
          const { ok, data } = await updatePost(postId, formData);
          if (ok && data.isSuccess) {
            showToast("게시글이 수정되었습니다!");
            setTimeout(() => {
              navigate(`/post-detail`, { postId });
            }, 800);
          } else {
            showToast("수정 실패");
          }
        },
      });

      container.innerHTML = ""; // 로딩 문구 제거
      container.appendChild(form);
    } catch (err) {
      showToast("게시글 정보를 불러올 수 없습니다.");
    }
  })();

  return container;
}
