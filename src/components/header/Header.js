import Button from "../../components/button/Button.js";

export default function Header({
  title,
  showBack = false,
  showProfile = false,
  onBack = null,
  onProfileClick = null,
}) {
  const header = document.createElement("header");
  header.className = "app-header";

  const inner = document.createElement("div");
  inner.className = "header-inner";

  // 왼쪽: 뒤로가기 버튼
  const left = document.createElement("div");
  left.className = "header-left";

  if (showBack) {
    const backButton = new Button({
      icon: "/assets/images/back_button.png",
      className: "icon",
      ariaLabel: "뒤로가기",
      onClick: () => history.back(),
    });
    left.appendChild(backButton.render());
  }

  // 중앙: 제목
  const center = document.createElement("h1");
  center.className = "header-title";
  center.textContent = title;

  // 오른쪽: 프로필 버튼
  const right = document.createElement("div");
  right.className = "header-right";

  if (showProfile) {
    const profileButton = new Button({
      icon: "/assets/images/default_profile.png",
      className: "icon",
      ariaLabel:"프로필",
      onClick: () => console.log("프로필 클릭"),
    })
    right.appendChild(profileButton.render());
  }

  // 구조 조립
  inner.appendChild(left);
  inner.appendChild(center);
  inner.appendChild(right);
  header.appendChild(inner);

  return header;
}
