import Button from "../../components/button/Button.js";

export default function PostDetailPage() {
  const container = document.createElement("div");
  container.className = "post-detail-container";

  // -------------------------------
  // 더미 게시글 데이터
  // -------------------------------
  const post = {
    id: 1,
    title: "오늘 점심 뭐 먹을까?",
    nickname: "더미 작성자1",
    createdAt: "2025-01-01T00:00:00",
    likeCount: 123,
    viewCount: 321,
    commentCount: 45,
    content: `무엇을 얘기할까요? 아무말이라면, 삶은 항상 놀라운 모험이라고 생각합니다. 
우리는 매일 새로운 경험을 하고 배우며 성장합니다. 때로는 어려움과 도전이 있지만, 
그것들이 우리를 더 강하고 지혜롭게 만듭니다. 자연은 아름다운 이야기입니다.`,
    imageUrl: "https://placehold.co/600x300",
  };

  const comments = [
    {
      id: 1,
      nickname: "더미 작성자1",
      createdAt: "2025-01-01T00:00:00",
      content: "좋은 글 잘 읽었습니다!",
    },
    {
      id: 2,
      nickname: "더미 작성자2",
      createdAt: "2025-01-01T00:00:00",
      content: "공감합니다 :)",
    },
  ];

  // 날짜 포맷 함수
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}:${String(
      d.getSeconds()
    ).padStart(2, "0")}`;
  };

  // -------------------------------
  // 🧩 ① 게시글 영역 (헤더 + 본문 통합)
  // -------------------------------
  const mainSection = document.createElement("div");
  mainSection.className = "post-main-section";

  // 제목
  const title = document.createElement("h1");
  title.className = "post-title";
  title.textContent = post.title;

  // 작성자 + 버튼 행
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
  const editBtn = document.createElement("button");
  editBtn.textContent = "수정";
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  actions.append(editBtn, deleteBtn);

  authorRow.append(authorLeft, actions);

  // 이미지
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "post-image-wrapper";
  const img = document.createElement("img");
  img.src = post.imageUrl;
  imageWrapper.appendChild(img);

  // 내용
  const content = document.createElement("div");
  content.className = "post-content";
  content.textContent = post.content;

  // 좋아요/조회수/댓글
  const stats = document.createElement("div");
  stats.className = "post-stats";
  stats.innerHTML = `
    <div><strong>${post.likeCount}</strong>좋아요</div>
    <div><strong>${post.viewCount}</strong>조회수</div>
    <div><strong>${post.commentCount}</strong>댓글</div>
  `;

  mainSection.append(title, authorRow, imageWrapper, content, stats);

  // -------------------------------
  // 🧩 ② 댓글 영역
  // -------------------------------
  const commentSection = document.createElement("div");
  commentSection.className = "post-comment-section";

  // 댓글 입력 박스
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

  // -------------------------------
  // 조립
  // -------------------------------
  container.append(mainSection, commentSection);

  return container;
}
