export default function Header({ title, actions = [] }) {
  const header = document.createElement("header");
  header.className = "app-header";

  const left = document.createElement("div");
  left.className = "header-left";

  const center = document.createElement("h1");
  center.className = "header-title";
  center.textContent = title;

  const right = document.createElement("div");
  right.className = "header-right";
  actions.forEach((btn) => right.appendChild(btn));

  header.appendChild(left);
  header.appendChild(center);
  header.appendChild(right);

  return header;
}
