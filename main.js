// EcoGuard Industries: theme toggle, active navigation, reveal animation, enquiry form.
(function () {
  "use strict";

  var body = document.body;
  var STORAGE_KEY = "ecoguard-theme";
  document.documentElement.classList.add("js");

  /* ---------- Theme ---------- */
  var toggle = document.getElementById("theme-toggle");

  function savedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    var dark = theme === "dark";
    body.classList.toggle("dark-theme", dark);
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute(
        "aria-label",
        dark ? "Switch to light theme" : "Switch to dark theme",
      );
      var icon = toggle.querySelector("i");
      if (icon) {
        icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    }
  }

  var initial =
    savedTheme() ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(initial);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = body.classList.contains("dark-theme") ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* storage unavailable */
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------- Active navigation (aria-current) ---------- */
  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = [
    "home",
    "about",
    "technology",
    "ecowildguard",
    "mission",
    "contact",
  ]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("data-nav") === id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });
    setActive("home");
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Contact form ----------
     No backend exists yet. Set data-endpoint on the form (for example a
     Formspree or custom API URL) and submissions will be POSTed there.
     Until then the form validates but sends nothing and says so. */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = form.querySelectorAll("input, textarea");
      var firstInvalid = null;
      fields.forEach(function (field) {
        var valid = field.checkValidity();
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid && !firstInvalid) {
          firstInvalid = field;
        }
      });
      if (firstInvalid) {
        setStatus("Please complete the highlighted fields.");
        firstInvalid.focus();
        return;
      }

      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        setStatus(
          "Thanks, but this form is not connected yet, so nothing was sent.",
        );
        return;
      }

      setStatus("Sending...");
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Request failed");
          }
          form.reset();
          setStatus("Message sent. We will be in touch.");
        })
        .catch(function () {
          setStatus("Something went wrong. Please try again later.");
        });
    });
  }
})();
