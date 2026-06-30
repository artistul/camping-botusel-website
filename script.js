document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const primaryNav = document.querySelector("#primary-nav");
const progress = document.querySelector(".scroll-progress");
const productNav = document.querySelector(".product-nav");
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = [...document.querySelectorAll("[data-section]")];
const samePageHashLinks = [...document.querySelectorAll('.primary-nav a[href^="#"], .product-nav a[href^="#"], .home-hero .button[href^="#"]')];

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

function getShortcutOffset() {
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const mobileSectionNavHeight = window.matchMedia("(max-width: 1060px)").matches
    ? productNav?.getBoundingClientRect().height || 0
    : 0;
  const visualGap = window.matchMedia("(max-width: 1060px)").matches ? 28 : 40;

  return headerHeight + mobileSectionNavHeight + visualGap;
}

function scrollToSectionTarget(target, updateHash = true) {
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getShortcutOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });

  if (updateHash) {
    history.pushState(null, "", `#${target.id}`);
  }
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

samePageHashLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    setActiveSection(target.dataset.section || id);
    scrollToSectionTarget(target);
  });
});

if (window.location.hash) {
  const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  requestAnimationFrame(() => scrollToSectionTarget(target, false));
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
