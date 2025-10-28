import Button from "../../components/button/Button.js";
import { appState } from "../../main.js";
import { fetchPostDetail } from "../../api/postApi.js";

export default function PostDetailPage() {
  const container = document.createElement("div");
  container.className = "post-detail-container";

  // -------------------------------
  // ✅ 날짜 포맷 유틸 함수
  // -------------------------------  
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

  // -------------------------------
  // ✅ 기본 구조 (게시글 + 댓글)
  // -------------------------------
  const mainSection = document.createElement("div");
  mainSection.className = "post-main-section";

  const commentSection = document.createElement("div");
  commentSection.className = "post-comment-section";

  container.append(mainSection, commentSection);

  // -------------------------------
  // ✅ 게시글 렌더링 함수
  // -------------------------------
  const renderPost = (post) => {
    mainSection.innerHTML = "";

    // 제목
    const title = document.createElement("h1");
    title.className = "post-title";
    title.textContent = post.title;

    // 작성자 정보 + 수정/삭제 버튼
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

    // ✅ 이미지 (더미로 대체)
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

  // -------------------------------
  // ✅ 더미 댓글 데이터
  // -------------------------------
  const comments = [
    {
      id: 1,
      nickname: "댓글작성자1",
      createdAt: "2025-01-01T00:00:00",
      content: "정말 공감돼요!",
    },
    {
      id: 2,
      nickname: "댓글작성자2",
      createdAt: "2025-01-02T12:30:00",
      content: "재밌게 읽었습니다 :)",
    },
  ];

  const renderComments = () => {
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

      const profile = document.createElement("div");
      profile.className = "profile-placeholder";

      const name = document.createElement("span");
      name.className = "comment-author";
      name.textContent = c.nickname;

      const date = document.createElement("span");
      date.className = "comment-date";
      date.textContent = formatDate(c.createdAt);

      const topLeft = document.createElement("div");
      topLeft.className = "comment-top-left";
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

  // -------------------------------
  // ✅ API 호출 및 초기 렌더링
  // -------------------------------
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
        renderComments();
      } else {
        container.innerHTML = `<p>게시글 정보를 불러올 수 없습니다.</p>`;
      }
    } catch (err) {
      console.error("게시글 상세조회 실패:", err);
      container.innerHTML = `<p>서버 오류가 발생했습니다.</p>`;
    }
  })();

  return container;
}
