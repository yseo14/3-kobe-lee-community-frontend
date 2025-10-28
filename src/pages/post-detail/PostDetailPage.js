import Button from "../../components/button/Button.js";
import { appState } from "../../main.js";
import { fetchPostDetail } from "../../api/postApi.js";
import { fetchComments } from "../../api/commentApi.js";

export default function PostDetailPage() {
  const container = document.createElement("div");
  container.className = "post-detail-container";

  // 날짜 포맷 유틸 함수
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

  // 기본 구조
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

    const actions = document.createElement("div");
    actions.className = "post-action-group";

    if (post.viewerCanEdit) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      actions.appendChild(editBtn);
    }

    if (post.viewerCanDelete) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "삭제";
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

  // 댓글 렌더링 함수
  const renderComments = (comments) => {
    commentSection.innerHTML = "";

    // 댓글 입력창
    const commentInputBox = document.createElement("div");
    commentInputBox.className = "comment-input-box";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "댓글을 남겨주세요!";
    const submitBtn = document.createElement("button");
    submitBtn.className = "btn-comment";
    submitBtn.textContent = "댓글 등록";
    commentInputBox.append(textarea, submitBtn);

    // 댓글 목록
    const commentList = document.createElement("div");
    commentList.className = "comment-list";

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

      const actions = document.createElement("div");
      actions.className = "comment-actions";
      actions.innerHTML = `<button>수정</button><button>삭제</button>`;

      top.append(topLeft, actions);

      const content = document.createElement("p");
      content.className = "comment-content";
      content.textContent = c.content;

      item.append(top, content);
      commentList.appendChild(item);
    });

    commentSection.append(commentInputBox, commentList);
  };

  // 게시글 상세 조회
  const postId = appState.pageData?.postId;
  if (!postId) {
    container.innerHTML = `<p>잘못된 접근입니다.</p>`;
    return container;
  }

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

  // 댓글 무한 스크롤을 위한 데이터
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
      });s

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

      console.log(
        `Loaded ${comments.length} comments, next cursor:`,
        cursorId,
        cursorCreatedAt
      );
    } catch (err) {
      console.error("서버 통신 에러:", err);
    } finally {
      isLoading = false;
    }
  };

  // 무한 스크롤 감시 객체 생성
  const observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isLastPage) {
        loadComments();
      }
    },
    {
      root: container,
      rootMargin: "0px 0px 150px 0px",
      threshold: 0,
    }
  );

  observer.observe(sentinel);

  // 첫 댓글 로드
  loadComments();

  return container;
}
