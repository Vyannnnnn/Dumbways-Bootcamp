import { Collapse } from "bootstrap";

// scroll progress bar
function updateProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
  const progressEl = document.getElementById("scrollProgress");
  if (!progressEl) return;
  progressEl.style.width = pct + "%";
}

// navbar scroll shadow
const mainNav = document.getElementById("mainNav");
window.addEventListener(
  "scroll",
  () => {
    if (!mainNav) return;
    mainNav.classList.toggle("scrolled", window.scrollY > 8);
  },
  { passive: true },
);

// typing effect for hello
(function () {
  const text = "Hello";
  const el = document.getElementById("typedText");
  const cursor = document.getElementById("cursor");
  if (!el || !cursor) return;
  let i = 0;
  const speed = 110;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 600 : speed); //  delay
    } else {
      cursor.classList.add("done");
    }
  }
  setTimeout(type, 800); // start after fade-in
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

// close mobile navbar on link click
// navLinks.forEach((link) => {
//   link.addEventListener("click", () => {
//     const collapseEl = document.getElementById("navMenu");
//     if (!collapseEl) return;
//     const bsInstance = Collapse.getOrCreateInstance(collapseEl);
//     if (bsInstance) bsInstance.hide();
//   });
// });

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
const btn = document.getElementById("backToTop");
function updateBtn() {
  if (!btn) return;
  btn.classList.toggle("show", window.scrollY > 400);
}

window.addEventListener(
  "scroll",
  () => {
    updateProgress();
    updateActiveLink();
    updateBtn();
  },
  { passive: true },
);
updateProgress();
updateActiveLink();
updateBtn();

// contact form submit on progress
// function handleSubmit() {
//   const form = document.getElementById("contactForm");
//   const inputs = form.querySelectorAll("input, textarea");
//   let allValid = true;

//   inputs.forEach((el) => {
//     if (!el.value.trim()) {
//       el.style.borderColor = "var(--red)";
//       el.classList.add("is-invalid");
//       allValid = false;
//     } else {
//       el.style.borderColor = "";
//       el.classList.remove("is-invalid");
//     }
//   });

//   if (!allValid) return;

//   const btn = document.getElementById("sendBtn");
//   btn.textContent = "✓ Message Sent!";
//   btn.style.background = "var(--teal)";
//   inputs.forEach((el) => (el.value = ""));

//   setTimeout(() => {
//     btn.textContent = "Send Message";
//     btn.style.background = "";
//   }, 3000);
// }
// window.handleSubmit = handleSubmit;




// local storage project cards
(function () {
  const form = document.getElementById("projectForm");
  const categoryInput = document.getElementById("projectCategory");
  const nameInput = document.getElementById("projectNameInput");
  const descriptionInput = document.getElementById("projectDescription");
  const projectsGrid = document.getElementById("projectsGrid");
  const submitButton = document.getElementById("sendBtn");
  const storageKey = "portfolioProjects";

  if (
    !form ||
    !projectsGrid ||
    !categoryInput ||
    !nameInput ||
    !descriptionInput ||
    !submitButton
  ) {
    return;
  }

  function getStoredProjects() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(storageKey, JSON.stringify(projects));
  }

  function createProjectCard(project) {
    const col = document.createElement("div");
    col.className = "col-md-6 reveal visible";

    const card = document.createElement("div");
    card.className = "card project-card h-100 border p-4";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body-inner";

    const categoryTag = document.createElement("span");
    categoryTag.className = "tag tag-yellow d-inline-block mb-2";
    categoryTag.textContent = project.category;

    const title = document.createElement("h5");
    title.textContent = project.projectName;

    const description = document.createElement("p");
    description.className = "text-muted mb-2";
    description.textContent = project.description;

    const detailLink = document.createElement("a");
    detailLink.href = "detailProject.html";
    detailLink.className = "text-decoration-none";
    detailLink.innerHTML =
      '<span class="card-arrow"><i class="bi bi-arrow-up-right"></i> View details</span>';
    detailLink.addEventListener("click", () => {
      localStorage.setItem("selectedProject", JSON.stringify(project));
    });

    cardBody.appendChild(categoryTag);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(detailLink);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
  }

  function renderStoredProjects() {
    const storedProjects = getStoredProjects();
    // filter 
    const validProjects = storedProjects.filter((project) => {
      return (
        typeof project?.category === "string" &&
        typeof project?.projectName === "string" &&
        typeof project?.description === "string" &&
        project.category.trim() &&
        project.projectName.trim() &&
        project.description.trim()
      );
    });

    projectsGrid
      .querySelectorAll('[data-source="local-storage"]')
      .forEach((item) => item.remove());

    // storedProjects.forEach((project) => {
    //   const cardEl = createProjectCard(project);
    //   cardEl.dataset.source = "local-storage";
    //   projectsGrid.prepend(cardEl);
    // });

    // use a map method
    validProjects.map((project) => {
      const cardEl = createProjectCard(project);
      cardEl.dataset.source = "local-storage";
      projectsGrid.prepend(cardEl);
    });
  }

  renderStoredProjects();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [categoryInput, nameInput, descriptionInput];
    let allValid = true;

    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        allValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (!allValid) return;

    const newProject = {
      category: categoryInput.value.trim(),
      projectName: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      createdAt: Date.now(),
    };

    const currentProjects = getStoredProjects();
    currentProjects.push(newProject);
    saveProjects(currentProjects);
    renderStoredProjects();

    form.reset();

    submitButton.textContent = "Added!";
    submitButton.style.background = "var(--teal)";

    // 1 of more fallbacks functions
    setTimeout(() => {
      submitButton.textContent = "Submit";
      submitButton.style.background = "";
    }, 1500);
  });
})();