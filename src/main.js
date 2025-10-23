import Header from "./components/header/Header.js";
import LoginPage from "./pages/login/LoginPage.js";
import SignupPage from "./pages/signup/SignupPage.js";
import PostListPage from "./pages/post-list/PostListPage.js";
import EditProfilePage from "./pages/edit-profile/EditProfilePage.js";
import PostCreatePage from './pages/post-create/postCreatePage.js';

export const appState = {
  pageData: null,
};

const root = document.querySelector("#root");

const layout = document.createElement("div");
layout.className = "layout";

let currentHeader = Header({ title: "아무 말 대잔치" });
layout.appendChild(currentHeader);

const content = document.createElement("div");
content.id = "content";
layout.appendChild(content);

root.appendChild(layout);

function renderPage(pageComponent, headerOptions = {}) {
  const newHeader = Header({
    title: "아무 말 대잔치",
    ...headerOptions, // showBack, showProfile 등 옵션 전달
  });

  layout.replaceChild(newHeader, currentHeader);
  currentHeader = newHeader;

  content.innerHTML = "";
  content.appendChild(pageComponent());
}

function handleRouting() {
  const path = window.location.hash.replace("#", ""); // 예: #/signup → /signup

  switch (path) {
    case "/signup":
      renderPage(SignupPage, { showBack: true, showProfile: false });
      break;

    case "/post-list":
      renderPage(PostListPage, { showBack: false, showProfile: true });
      break;

    case "/post-create":
      renderPage(PostCreatePage, { showBack: true, showProfile: true });
      break;

    case "/edit-profile":
      renderPage(EditProfilePage, { showBack: true });
      break;

    case "/login":
    default:
      renderPage(LoginPage, { showBack: false, showProfile: false });
      break;
  }
}

window.addEventListener("load", handleRouting);
window.addEventListener("hashchange", handleRouting);

export function navigate(path, data = null) {
  console.log(window.location.hash);
  appState.pageData = data;
  window.location.hash = path;
}

export { renderPage };
