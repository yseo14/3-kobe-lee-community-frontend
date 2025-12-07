import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { fetchPosts } from "/src/api/postApi.js";
import { getS3ImageUrl } from "/src/config/appConfig.js";

export default function PostListPage() {
  const container = document.createElement("div");
  container.className = "post-list-container";

  const introSection = document.createElement("div");
  introSection.className = "intro-section";

  // 농구 아이콘과 텍스트를 함께 배치
  const icon0 = document.createElement("span");
  icon0.className = "intro-icon";
  icon0.textContent = "⛹️‍♂️";

  const icon1 = document.createElement("span");
  icon1.className = "intro-icon";
  icon1.textContent = "🏀";

  const introText = document.createElement("p");
  introText.className = "intro-text";
  introText.textContent = "공 하나로 통하는 우리들의 이야기";

  const icon2 = document.createElement("span");
  icon2.className = "intro-icon";
  icon2.textContent = "👟";

  const icon3 = document.createElement("span");
  icon3.className = "intro-icon";
  icon3.textContent = "🏆";

  introSection.appendChild(icon0);
  introSection.appendChild(icon1);
  introSection.appendChild(introText);
  introSection.appendChild(icon2);
  introSection.appendChild(icon3);
  container.appendChild(introSection);

  // 게시글 작성 버튼 (오른쪽 정렬)
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

  // 게시글 목록
  const postList = document.createElement("div");
  postList.className = "post-list";
  container.appendChild(postList);

  // sentinel: 해당 객체가 화면에 보이면 api를 전송한다.
  const sentinel = document.createElement("div");
  sentinel.className = "scroll-sentinel";
  postList.appendChild(sentinel);

  const PAGE_SIZE = 10;
  let isLoading = false;
  let isLastPage = false;
  let sortType = "createdAt";
  let cursorId = null;
  let cursorValue = null;

  // -------------------------------
  // 게시글 렌더링 함수
  // -------------------------------
  const renderPosts = (posts) => {
    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "post-card";

      // 게시글 미리보기 카드를 누르면 상세조회 페이지로 전환
      card.addEventListener("click", () => {
        console.log("게시글 상세조회", post.postId);
        navigate("/post-detail", {postId : post.postId})
      });

      const titleRow = document.createElement("div");
      titleRow.className = "post-title-row";

      const title = document.createElement("h3");
      title.textContent = post.title;

      const date = document.createElement("span");
      date.className = "post-date";

      // 날짜 포맷: 2025-10-24 12:16:00
      const d = new Date(post.createdAt);
      const formattedDate = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(
        d.getHours()
      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds()
      ).padStart(2, "0")}`;

      date.textContent = formattedDate;
      titleRow.append(title, date);

      // 좋아요/댓글/조회수 행
      const infoRow = document.createElement("div");
      infoRow.className = "post-info";
      infoRow.textContent = `좋아요 ${post.likeCount}   댓글 ${post.commentCount}   조회수 ${post.viewCount}`;

      // 구분선 추가
      const divider = document.createElement("hr");
      divider.className = "post-divider";

      // 작성자
      const authorRow = document.createElement("div");
      authorRow.className = "post-author";

      const profile = document.createElement("img");
      profile.className = "profile-image";
      if (post.profileImageKey) {
        profile.src = getS3ImageUrl(post.profileImageKey);
      } else {
        profile.src = "/assets/images/default_profile.png";
      }
      profile.alt = "프로필 이미지";

      const authorName = document.createElement("span");
      authorName.textContent = post.nickname;

      authorRow.append(profile, authorName);

      // 조립
      card.append(titleRow, infoRow, divider, authorRow);
      postList.insertBefore(card, sentinel);
    });
  };

  // -------------------------------
  // 게시글 불러오기 (API)
  // -------------------------------
  const loadPosts = async () => {
    if (isLoading || isLastPage) return;
    isLoading = true;

    try {
      const { ok, data } = await fetchPosts({
        sort: sortType,
        limit: PAGE_SIZE,
        cursorId,
        cursorValue,
      });

      if (!ok || !data.isSuccess) {
        console.error("게시글 불러오기 실패:", data.message);
        isLoading = false;
        return;
      }

      const posts = data.result.postList || [];
      if (posts.length === 0) {
        console.log("더 이상 게시글 없음");
        isLastPage = true;
        observer.disconnect();
        return;
      }

      renderPosts(posts);

      // 다음 페이지용 커서 갱신
      cursorId = data.result.nextCursorId;
      cursorValue = data.result.nextCursorValue;

      console.log(
        `Loaded ${posts.length} posts, next cursor:`,
        cursorId,
        cursorValue
      );
    } catch (err) {
      console.error("서버 통신 에러:", err);
    } finally {
      isLoading = false;
    }
  };

  // -------------------------------
  // 무한 스크롤 트리거
  // -------------------------------
  const observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isLastPage) {
        loadPosts();
      }
    },
    {
      root: postList, // 내부 스크롤 기준 변경
      rootMargin: "0px 0px 150px 0px", // 스크롤 하단 여유 공간
      threshold: 0,
    }
  );

  observer.observe(sentinel);

  // 정렬 토글 섹션
  const sortSection = document.createElement("div");
  sortSection.className = "sort-section";

  const sortOptions = [
    { value: "createdAt", label: "최신순" },
    { value: "likes", label: "좋아요순" },
    { value: "comments", label: "댓글순" },
    { value: "views", label: "조회수순" },
  ];

  sortOptions.forEach((option) => {
    const sortButton = document.createElement("button");
    sortButton.className = "sort-button";
    sortButton.textContent = option.label;
    sortButton.dataset.sort = option.value;

    if (option.value === sortType) {
      sortButton.classList.add("active");
    }

    sortButton.addEventListener("click", () => {
      // 활성화 상태 변경
      sortSection.querySelectorAll(".sort-button").forEach((btn) => {
        btn.classList.remove("active");
      });
      sortButton.classList.add("active");

      // 정렬 타입 변경
      sortType = option.value;

      // 게시글 목록 초기화
      postList.innerHTML = "";
      postList.appendChild(sentinel);

      // 커서 초기화
      cursorId = null;
      cursorValue = null;
      isLastPage = false;

      // 옵저버 재연결
      observer.disconnect();
      observer.observe(sentinel);

      // 첫 페이지 다시 로드
      loadPosts();
    });

    sortSection.appendChild(sortButton);
  });

  // 정렬 섹션을 intro 섹션과 버튼 섹션 사이에 삽입
  container.insertBefore(sortSection, buttonSection);

  // 첫 로드
  loadPosts();

  return container;
}
