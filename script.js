const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const typingText = document.querySelector(".typing-text");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector("#contact-form");
const currentYear = document.querySelector("#current-year");

function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  const clickedOutsideMenu =
    !navMenu.contains(event.target) && !menuToggle.contains(event.target);

  if (clickedOutsideMenu && navMenu.classList.contains("open")) {
    closeMenu();
  }
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const savedTheme = localStorage.getItem("portfolio-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
  body.classList.add("dark-theme");
}

function updateThemeIcon() {
  const isDark = body.classList.contains("dark-theme");
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  localStorage.setItem(
    "portfolio-theme",
    body.classList.contains("dark-theme") ? "dark" : "light"
  );
  updateThemeIcon();
});

updateThemeIcon();

if (typingText) {
  const roles = JSON.parse(typingText.dataset.roles);
  let roleIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      characterIndex -= 1;
    } else {
      characterIndex += 1;
    }

    typingText.textContent = currentRole.slice(0, characterIndex);

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && characterIndex === currentRole.length) {
      isDeleting = true;
      delay = 1300;
    } else if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    window.setTimeout(typeRole, delay);
  }

  window.setTimeout(typeRole, 500);
}

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const shouldShow =
        selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

function setFieldError(field, message) {
  field.classList.add("invalid");
  const errorElement = field.parentElement.querySelector(".error-message");
  errorElement.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove("invalid");
  const errorElement = field.parentElement.querySelector(".error-message");
  errorElement.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const subject = contactForm.elements.subject;
  const message = contactForm.elements.message;
  const formStatus = contactForm.querySelector(".form-status");

  [name, email, subject, message].forEach(clearFieldError);
  formStatus.textContent = "";

  let isValid = true;

  if (name.value.trim().length < 2) {
    setFieldError(name, "Please enter at least two characters.");
    isValid = false;
  }

  if (!isValidEmail(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (subject.value.trim().length < 3) {
    setFieldError(subject, "Please enter a clear subject.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "Please enter a message of at least ten characters.");
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = "Please correct the highlighted fields.";
    formStatus.style.color = "#dc2626";
    return;
  }

  formStatus.textContent =
    "Form validated successfully. Connect this form to a backend or email service to receive messages.";
  formStatus.style.color = "var(--accent)";
  contactForm.reset();
});

contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => clearFieldError(field));
});

currentYear.textContent = new Date().getFullYear();
