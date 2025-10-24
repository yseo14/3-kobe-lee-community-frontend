export default function Footer() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";

  const inner = document.createElement("div");
  inner.className = "footer-inner";

  const BACKEND_URL = "http://localhost:8080";

  // 이용약관 링크
  const termsLink = document.createElement("a");
  termsLink.href = `${BACKEND_URL}/terms`;
  termsLink.textContent = "이용약관";
  termsLink.className = "footer-link";
  termsLink.target = "_blank";

  // 구분점
  const divider = document.createElement("span");
  divider.className = "footer-divider";
  divider.textContent = "·";

  // 개인정보처리방침 링크
  const privacyLink = document.createElement("a");
  privacyLink.href = `${BACKEND_URL}/privacy`;
  privacyLink.textContent = "개인정보처리방침";
  privacyLink.className = "footer-link";
  privacyLink.target = "_blank";

  inner.append(termsLink, divider, privacyLink);
  footer.appendChild(inner);

  return footer;
}
