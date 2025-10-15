import LoginPage from "./pages/login/LoginPage.js";
import HomePage from "./pages/home/HomePage.js";

const root = document.querySelector("#root");

function renderPage(pageComponent) {
  root.innerHTML = "";
  root.appendChild(pageComponent());
}

renderPage(LoginPage);

export { renderPage, HomePage };
