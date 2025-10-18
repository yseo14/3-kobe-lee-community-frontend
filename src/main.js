import Header from "./components/header/Header.js";
import LoginPage from "./pages/login/LoginPage.js";

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

renderPage(LoginPage, { showBack: false, showProfile: false });

export { renderPage };
