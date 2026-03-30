import { Collapse } from "bootstrap";

// scroll progress bar
function updateProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
  document.getElementById("scrollProgress").style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress);

// navbar scroll shadow
const mainNav = document.getElementById("mainNav");
window.addEventListener(
  "scroll",
  () => {
    mainNav.classList.toggle("scrolled", window.scrollY > 8);
  },
  { passive: true },
);

// typing effect for "Hello"
(function () {
  const text = "Hello";
  const el = document.getElementById("typedText");
  const cursor = document.getElementById("cursor");
  let i = 0;
  const speed = 110;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 600 : speed); // initial delay
    } else {
      cursor.classList.add("done");
    }
  }
  setTimeout(type, 800); // start after hero fade-in begins
})();

// active nav link highlight on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const navHeight = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
);

function updateActiveLink() {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - navHeight - 10) {
      current = sec.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active-link",
      link.getAttribute("href") === "#" + current,
    );
  });
}
window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

// close mobile navbar on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const collapseEl = document.getElementById("navMenu");
    const bsInstance = Collapse.getOrCreateInstance(collapseEl);
    if (bsInstance) bsInstance.hide();
  });
});

// scroll-reveal
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [
          ...entry.target.parentElement.querySelectorAll(".reveal"),
        ];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = idx * 80 + "ms";
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealEls.forEach((el) => observer.observe(el));

// back to top button
const btt = document.getElementById("backToTop");
function updateBtt() {
  btt.classList.toggle("show", window.scrollY > 400);
}

window.addEventListener(
  "scroll",
  () => {
    updateProgress();
    updateActiveLink();
    updateBtt();
  },
  { passive: true },
);
updateActiveLink();

// contact form submit on progress
function handleSubmit() {
  const form = document.getElementById("contactForm");
  const inputs = form.querySelectorAll("input, textarea");
  let allValid = true;

  inputs.forEach((el) => {
    if (!el.value.trim()) {
      el.style.borderColor = "var(--red)";
      el.classList.add("is-invalid");
      allValid = false;
    } else {
      el.style.borderColor = "";
      el.classList.remove("is-invalid");
    }
  });

  if (!allValid) return;

  const btn = document.getElementById("sendBtn");
  btn.textContent = "✓ Message Sent!";
  btn.style.background = "var(--teal)";
  inputs.forEach((el) => (el.value = ""));

  setTimeout(() => {
    btn.textContent = "Send Message";
    btn.style.background = "";
  }, 3000);
}

window.handleSubmit = handleSubmit;
