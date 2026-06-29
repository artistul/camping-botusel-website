document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const primaryNav = document.querySelector("#primary-nav");
const progress = document.querySelector(".scroll-progress");
const productNav = document.querySelector(".product-nav");
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = [...document.querySelectorAll("[data-section]")];

function setActiveSection(sectionId) {
  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.sectionLink === sectionId);
  });
}

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (progress) {
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
  }

  document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
  header?.classList.toggle("is-scrolled", header.hasAttribute("data-solid-header") || window.scrollY > 18);

  if (productNav && sections.length) {
    const marker = window.innerHeight * 0.42;
    const firstSectionTop = sections[0].getBoundingClientRect().top;
    let activeSection = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= marker) {
        activeSection = section.dataset.section;
      }
    });

    productNav.classList.toggle("is-visible", firstSectionTop <= marker);
    setActiveSection(activeSection);
  }
}

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

function closeMenu() {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  header?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const nextOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(nextOpen));
    primaryNav.classList.toggle("is-open", nextOpen);
    header?.classList.toggle("is-open", nextOpen);
    document.body.classList.toggle("menu-open", nextOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveSection(link.dataset.sectionLink);
  });
});

if (!prefersReducedMotion) {
  document.querySelectorAll(".gallery-item img").forEach((image) => {
    image.addEventListener("pointermove", (event) => {
      const rect = image.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      image.style.transform = `scale(1.045) translate(${x}px, ${y}px)`;
    });

    image.addEventListener("pointerleave", () => {
      image.style.transform = "";
    });
  });
}
