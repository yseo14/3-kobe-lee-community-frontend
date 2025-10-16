import Header from "./components/header/Header.js";
import LoginPage from "./pages/login/LoginPage.js";
import SignupPage from "./pages/signup/SignupPage.js";
import ProfileUpload from "./components/profile-upload/ProfileUpload.js";

const root = document.querySelector("#root");

const layout = document.createElement("div");
layout.className = "layout";

const header = Header({ title: "아무 말 대잔치" });
layout.appendChild(header);

const content = document.createElement("div");
content.id = "content";
layout.appendChild(content);

root.appendChild(layout);

function renderPage(pageComponent) {
  content.innerHTML = "";
  content.appendChild(pageComponent());
}

// renderPage(LoginPage);
renderPage(SignupPage);

export { renderPage };
