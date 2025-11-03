import Button from "../../components/button/Button.js";
import { fetchPostDetail } from "../../api/postApi.js";
import { fetchComments } from "../../api/commentApi.js";
import { navigate } from "../../main.js";
import { deletePost } from "../../api/postApi.js";
import { showToast } from "../../utils/showToast.js";
import Modal from "../../components/modal/modal.js";

export default function PostDetailPage(postIdFromRoute) {
  const container = document.createElement("div");
  container.className = "post-detail-container";

  // postId를 URL에서 직접 가져온다
  const postId = postIdFromRoute || window.location.hash.split("/").pop(); // 예: #/post-detail/17 → 17

  if (!postId || isNaN(postId)) {
    container.innerHTML = `<p>잘못된 접근입니다.</p>`;
    return container;
  }

  // 날짜 포맷 함수
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // 전체 기본 구조
  const mainSection = document.createElement("div");
  mainSection.className = "post-main-section";

  const commentSection = document.createElement("div");
  commentSection.className = "post-comment-section";

  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";

  container.append(mainSection, commentSection, sentinel);

  // 게시글 렌더링
  const renderPost = (post) => {
    mainSection.innerHTML = "";

    const title = document.createElement("h1");
    title.className = "post-title";
    title.textContent = post.title;

    // 작성자 정보
    const authorRow = document.createElement("div");
    authorRow.className = "post-author-row";

    const authorLeft = document.createElement("div");
    authorLeft.className = "author-left";

    const profile = document.createElement("div");
    profile.className = "profile-placeholder";

    const authorName = document.createElement("span");
    authorName.className = "author-name";
    authorName.textContent = post.nickname;

    const date = document.createElement("span");
    date.className = "post-date";
    date.textContent = formatDate(post.createdAt);

    authorLeft.append(profile, authorName, date);

    // 수정 / 삭제 버튼
    const actions = document.createElement("div");
    actions.className = "post-action-group";

    if (post.viewerCanEdit) {
      const editBtn = new Button({
        text: "수정",
        className: "secondary-outline",
        onClick: () => navigate(`/post-detail/${postId}/post-edit`),
        width: "60px",
        height: "32px",
      }).render();
      actions.appendChild(editBtn);
    }

    // 삭제 버튼 클릭
    if (post.viewerCanDelete) {
      const deleteBtn = new Button({
        text: "삭제",
        className: "secondary-outline",
        onClick: () => {
          const modal = new Modal({
            title: "게시글을 삭제하시겠습니까?",
            message: "삭제한 내용은 복구할 수 없습니다.",
            cancelText: "취소",
            confirmText: "확인",
            onConfirm: async () => {
              try {
                const { ok, data } = await deletePost(post.postId);
                if (ok && data.isSuccess) {
                  showToast("게시글이 성공적으로 삭제되었습니다.");
                  navigate("/post-list");
                } else {
                  showToast(data?.message || "게시글 삭제에 실패했습니다.");
                }
              } catch (err) {
                console.error("게시글 삭제 실패:", err);
                showToast("서버 오류로 삭제에 실패했습니다.");
              }
            },
            onCancel: () => {
              console.log("삭제 취소");
            },
          });

          modal.open();
        },
        width: "60px",
        height: "32px",
      }).render();
      actions.appendChild(deleteBtn);
    }

    authorRow.append(authorLeft, actions);

    // 이미지 (더미)
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "post-image-wrapper";
    const img = document.createElement("img");
    img.src = "https://placehold.co/600x300";
    imageWrapper.appendChild(img);

    // 본문 내용
    const content = document.createElement("div");
    content.className = "post-content";
    content.textContent = post.content;

    // 좋아요/조회수/댓글
    const stats = document.createElement("div");
    stats.className = "post-stats";
    stats.innerHTML = `
      <div><strong>${post.likeCount}</strong> 좋아요</div>
      <div><strong>${post.viewCount}</strong> 조회수</div>
      <div><strong>${post.commentCount}</strong> 댓글</div>
    `;

    mainSection.append(title, authorRow, imageWrapper, content, stats);
  };

  // 댓글 렌더링
  const renderComments = (comments = []) => {
    commentSection.innerHTML = "";

    // 항상 댓글 입력창은 표시
    const commentInputBox = document.createElement("div");
    commentInputBox.className = "comment-input-box";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "댓글을 남겨주세요!";
    const submitBtn = document.createElement("button");
    submitBtn.className = "btn-comment";
    submitBtn.textContent = "댓글 등록";
    commentInputBox.append(textarea, submitBtn);

    const commentList = document.createElement("div");
    commentList.className = "comment-list";

    if (comments.length > 0) {
      comments.forEach((c) => {
        const item = document.createElement("div");
        item.className = "comment-item";

        const top = document.createElement("div");
        top.className = "comment-top";

        const topLeft = document.createElement("div");
        topLeft.className = "comment-top-left";

        const profile = document.createElement("div");
        profile.className = "profile-placeholder";

        const name = document.createElement("span");
        name.className = "comment-author";
        name.textContent = c.nickname;

        const date = document.createElement("span");
        date.className = "comment-date";
        date.textContent = formatDate(c.createdAt);

        topLeft.append(profile, name, date);

        // 수정/삭제 버튼
        const actions = document.createElement("div");
        actions.className = "comment-actions";

        if (c.viewerCanEdit) {
          const editBtn = new Button({
            text: "수정",
            className: "secondary-outline",
            onClick: () => console.log("댓글 수정 클릭", c.commentId),
            width: "60px",
            height: "28px",
          }).render();
          actions.appendChild(editBtn);
        }
        if (c.viewerCanDelete) {
          const deleteBtn = new Button({
            text: "삭제",
            className: "secondary-outline",
            onClick: () => console.log("댓글 삭제 클릭", c.commentId),
            width: "60px",
            height: "28px",
          }).render();
          actions.appendChild(deleteBtn);
        }

        top.append(topLeft, actions);

        const content = document.createElement("p");
        content.className = "comment-content";
        content.textContent = c.content;

        item.append(top, content);
        commentList.appendChild(item);
      });
    }

    commentSection.append(commentInputBox, commentList);
  };

  // 게시글 상세 조회
  (async () => {
    try {
      const { ok, data } = await fetchPostDetail(postId);
      if (ok && data.isSuccess) {
        renderPost(data.result);
      } else {
        container.innerHTML = `<p>게시글 정보를 불러올 수 없습니다.</p>`;
      }
    } catch (err) {
      console.error("게시글 상세조회 실패:", err);
      container.innerHTML = `<p>서버 오류가 발생했습니다.</p>`;
    }
  })();

  // 댓글 무한 스크롤
  const PAGE_SIZE = 10;
  let isLoading = false;
  let isLastPage = false;
  let sortType = "createdAt";
  let cursorId = null;
  let cursorCreatedAt = null;

  const loadComments = async () => {
    if (isLastPage || isLoading) return;
    isLoading = true;

    try {
      const { ok, data } = await fetchComments(postId, {
        sort: sortType,
        limit: PAGE_SIZE,
        cursorId,
        cursorCreatedAt,
      });

      if (!ok || !data.isSuccess) {
        console.error("댓글 목록 불러오기 실패:", data?.message);
        isLoading = false;
        return;
      }

      const comments = data.result.commentList || [];
      renderComments(comments);

      if (comments.length === 0) {
        console.log("댓글이 없습니다. 입력창만 표시됩니다.");
        isLastPage = true;
        observer.disconnect();
        return;
      }

      cursorId = data.result.nextCursorId;
      cursorCreatedAt = data.result.nextCursorCreatedAt;
    } catch (err) {
      console.error("서버 통신 에러:", err);
    } finally {
      isLoading = false;
    }
  };

  // 스크롤 감시자
  const observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isLastPage) {
        loadComments();
      }
    },
    { root: container, rootMargin: "0px 0px 150px 0px", threshold: 0 }
  );

  observer.observe(sentinel);
  loadComments();

  return container;
}
