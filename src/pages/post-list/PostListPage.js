import Button from "../../components/button/Button.js";
import { navigate } from '../../main.js';

export default function PostListPage() {
  const container = document.createElement("div");
  container.className = "post-list-container";

  const introSection = document.createElement("div");
  introSection.className = "intro-section";

  const introText = document.createElement("p");
  introText.innerHTML = `
    안녕하세요,<br />
    아무 말 대잔치 <strong>게시판</strong> 입니다.
  `;

  introSection.appendChild(introText);
  container.appendChild(introSection);

  // 📝 게시글 작성 버튼 (오른쪽 정렬)
  const buttonSection = document.createElement("div");
  buttonSection.className = "post-write-section";

  const writeButton = new Button({
    text: "게시글 작성",
    className: "primary",
    width: "100px",
    onClick: () => {
      navigate("/post-create");
    },
  });

  buttonSection.appendChild(writeButton.render());
  container.appendChild(buttonSection);

  const postList = document.createElement("div");
  postList.className = "post-list";

  const dummyPosts = [
    {
      id: 1,
      title: "제목 1",
      author: "더미 작성자1",
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: "2021-01-01 00:00:00",
    },
    {
      id: 2,
      title: "제목 2",
      author: "더미 작성자2",
      likes: 10,
      comments: 2,
      views: 33,
      createdAt: "2021-02-01 12:00:00",
    },
  ];

  // 카드 생성 함수
  dummyPosts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    const titleRow = document.createElement("div");
    titleRow.className = "post-title-row";

    const title = document.createElement("h3");
    title.textContent = post.title;

    const date = document.createElement("span");
    date.className = "post-date";
    date.textContent = post.createdAt;

    titleRow.appendChild(title);
    titleRow.appendChild(date);

    const infoRow = document.createElement("div");
    infoRow.className = "post-info";
    infoRow.textContent = `좋아요 ${post.likes}   댓글 ${post.comments}   조회수 ${post.views}`;

    const authorRow = document.createElement("div");
    authorRow.className = "post-author";

    const profile = document.createElement("div");
    profile.className = "profile-placeholder";

    const authorName = document.createElement("span");
    authorName.textContent = post.author;

    authorRow.appendChild(profile);
    authorRow.appendChild(authorName);

    card.appendChild(titleRow);
    card.appendChild(infoRow);
    card.appendChild(authorRow);

    postList.appendChild(card);
  });

  container.appendChild(postList);

  return container;
}
