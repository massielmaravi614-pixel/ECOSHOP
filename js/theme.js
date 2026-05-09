function initTheme() {
  if (!localStorage.getItem("themeEco")) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeIcon.textContent =
    currentTheme === "light"
      ? "🌙"
      : "☀️";

  localStorage.setItem("themeEco", currentTheme);
}

function toggleTheme() {
  currentTheme =
    currentTheme === "light"
      ? "dark"
      : "light";

  applyTheme();
}

themeBtn.addEventListener("click", toggleTheme);