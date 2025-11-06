import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";

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

  // 🧩 기존엔 조건부 생성이었지만, update()에서 제어할 수 있게 항상 생성
  const backButton = new Button({
    icon: "/assets/images/back_button.png",
    className: "icon",
    ariaLabel: "뒤로가기",
    onClick: () => (onBack ? onBack() : history.back()),
  }).render();
  left.appendChild(backButton);

  // 중앙: 제목
  const center = document.createElement("h1");
  center.className = "header-title";
  center.textContent = title;

  // 제목 클릭 시 게시글 목록으로 이동
  center.addEventListener("click", () => {
    navigate("/post-list");
  });
  // 오른쪽: 프로필 버튼
  const right = document.createElement("div");
  right.className = "header-right";

  // 프로필 버튼 컨테이너
  const profileContainer = document.createElement("div");
  profileContainer.className = "profile-container";

  const profileButton = new Button({
    icon: "/assets/images/default_profile.png", // todo: 현재는 정적 이미지. 이미지 처리 기능 구현 시 수정 필요
    className: "icon",
    ariaLabel: "프로필",
    onClick: (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    },
  }).render();

  // 드롭다운 메뉴 생성
  const dropdown = document.createElement("div");
  dropdown.className = "profile-dropdown";

  const editProfile = document.createElement("button");
  editProfile.textContent = "회원정보 수정";
  editProfile.onclick = async () => {
    dropdown.classList.remove("show");
    navigate("/edit-profile");
  };

  const changePassword = document.createElement("button");
  changePassword.textContent = "비밀번호 수정";
  changePassword.onclick = () => {
    dropdown.classList.remove("show");
    navigate("/change-password");
  };

  const logout = document.createElement("button");
  logout.textContent = "로그아웃";
  logout.onclick = () => {
    dropdown.classList.remove("show");
    sessionStorage.clear();
    navigate("/login");
  };

  dropdown.append(editProfile, changePassword, logout);

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", (e) => {
    if (!profileContainer.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  profileContainer.append(profileButton, dropdown);
  right.appendChild(profileContainer);

  // 구조 조립
  inner.append(left, center, right);
  header.appendChild(inner);

  // 헤더의 상태를 갱신하는 update() 메서드
  header.update = ({ title, showBack, showProfile }) => {
    if (title !== undefined) center.textContent = title;

    // 조건에 따라 뒤로가기, 프로필 버튼 노출 여부 변경
    backButton.style.display = showBack ? "flex" : "none";
    right.style.display = showProfile ? "flex" : "none";
  };

  // 초기 상태 설정
  header.update({ title, showBack, showProfile });

  return header;
}
