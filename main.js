const body = document.querySelector("body"); // Reference body tage
const themeToggle = document.getElementById("theme-icon"); // Reference theme-icon element using ID
const paragraphElem = document.querySelectorAll("p");
const footer = document.getElementById("footer");

// Change theme colour based on what theme is currently applied
themeToggle.addEventListener("click", () => {
  if (body.style.backgroundColor == "var(--platinum)") {
    body.style.backgroundColor = "var(--carbon-black)";
    footer.style.backgroundColor = "var(--platinum)";
    footer.style.color = "var(--carbon-black)";

  } else {
    body.style.backgroundColor = "var(--platinum)";
    footer.style.backgroundColor = "var(--carbon-black)";
    footer.style.color = "var(--platinum)";
  }
});
