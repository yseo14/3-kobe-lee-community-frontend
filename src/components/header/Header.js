import Button from "../../components/button/Button.js";
import { navigate } from "../../main.js";
import { getMyInfo } from "../../api/memberApi.js";

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
      onClick: () => (onBack ? onBack() : history.back()),
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
    const profileContainer = document.createElement("div");
    profileContainer.className = "profile-container";

    const profileButton = new Button({
      icon: "/assets/images/default_profile.png",
      className: "icon",
      ariaLabel: "프로필",
      onClick: (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      },
    });

    // 드롭다운 메뉴 생성
    const dropdown = document.createElement("div");
    dropdown.className = "profile-dropdown";

    // 회원정보 수정
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

    profileContainer.append(profileButton.render(), dropdown);
    right.appendChild(profileContainer);
  }

  // 구조 조립
  inner.append(left, center, right);
  header.appendChild(inner);

  return header;
}
