const body = document.querySelector("body");
const themeToggle = document.getElementById("theme-icon");

themeToggle.addEventListener("click", () => {
  if (body.style.backgroundColor == "var(--platinum)") {
    body.style.backgroundColor = "var(--carbon-black)";
  } else {
    body.style.backgroundColor = "var(--platinum)";
  }
});

