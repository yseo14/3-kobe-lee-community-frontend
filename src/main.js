import Header from "./components/header/Header.js";
import LoginPage from "./pages/login/LoginPage.js";
import SignupPage from "./pages/signup/SignupPage.js";
import PostListPage from "./pages/post-list/PostListPage.js";
import EditProfilePage from "./pages/edit-profile/EditProfilePage.js";
import PostCreatePage from "./pages/post-create/postCreatePage.js";
import Footer from "./components/footer/Footer.js";
import PostDetailPage from "./pages/post-detail/PostDetailPage.js";

export const appState = {
  pageData: null,
};

const root = document.querySelector("#root");

const layout = document.createElement("div");
layout.className = "layout";

// 초기 헤더 생성
const header = Header({
  title: "아무 말 대잔치",
  showBack: false,
  showProfile: false,
});
layout.appendChild(header);

// content, 페이지가 전환되며 내용이 들어가는 공간
const content = document.createElement("main");
content.id = "content";
layout.appendChild(content);

//  푸터
const footer = Footer();
layout.appendChild(footer);

root.appendChild(layout);

// 페이지 전환 함수
function renderPage(pageComponent, headerOptions = {}) {
  // 페이지 전환시 Header의 update()를 호출하여 상태 변경(뒤로가기, 프로필 버튼 여부)
  header.update({
    title: "아무 말 대잔치",
    ...headerOptions,
  });

  content.innerHTML = ""; //  기존의 content 영역 내 페이지 제거
  content.appendChild(pageComponent()); //  새로운 페이지로 전환
}

// 페이지 전환을 위한 라우팅 함수
function handleRouting() {
  // 예: "#/post-detail/17"
  const hash = window.location.hash.replace("#", "");
  const [route, id] = hash.split("/").filter(Boolean); // ['post-detail', '17']

  // 라우트에 따라 페이지 전환
  switch (`/${route || ""}`) {
    case "/signup":
      renderPage(SignupPage, { showBack: true, showProfile: false });
      break;

    case "/post-list":
      renderPage(PostListPage, { showBack: false, showProfile: true });
      break;

    case "/post-create":
      renderPage(PostCreatePage, { showBack: true, showProfile: true });
      break;

    case "/post-detail": {
      // postId는 URL(#/post-detail/17) 또는 appState에서 가져옴
      const postId = id || appState.pageData?.postId;
      if (!postId) {
        content.innerHTML = `<p>잘못된 접근입니다.</p>`;
        return;
      }
      renderPage(() => PostDetailPage(postId), {
        showBack: true,
        showProfile: true,
      });
      break;
    }

    case "/edit-profile":
      renderPage(EditProfilePage, { showBack: true, showProfile: true });
      break;

    case "/login":
    default:
      renderPage(LoginPage, { showBack: false, showProfile: false });
      break;
  }
}

export function navigate(path, params = {}) {
  const currentHash = window.location.hash;
  console.log("이전 페이지:", currentHash);

  // postId가 있으면 URL에 포함 (#/post-detail/17)
  if (params.postId) {
    window.location.hash = `${path.replace(/\/$/, "")}/${params.postId}`;
  } else {
    window.location.hash = path;
  }

  console.log("현재 페이지:", window.location.hash);
}

//  초기 렌더링 시, 즉 최초 한번 실행
window.addEventListener("load", handleRouting);
//  이후 url의 해시(# 뒷부분)이 바뀔 때마다 실행
window.addEventListener("hashchange", handleRouting);

export { renderPage };
