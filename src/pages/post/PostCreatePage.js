import PostForm from "/src/components/post-form/PostForm.js";
import { createPost } from "/src/api/postApi.js";
import { showToast } from "/src/utils/showToast.js";
import { navigate } from "/src/main.js";

export default function PostCreatePage() {
  const container = document.createElement("div");
  container.className = "post-create-container";

  const form = PostForm({
    mode: "create",
    onSubmit: async (formData) => {
      console.log("게시글 생성 요청:", formData);
      const { ok, data } = await createPost(formData);
      if (ok && data.isSuccess) {
        showToast("게시글이 작성되었습니다!");
        setTimeout(() => {
          navigate(`/post-detail`, { postId: data.result.postId });
        }, 800);
      } else {
        showToast("게시글 등록 실패");
      }
    },
  });

  container.appendChild(form);
  return container;
}
