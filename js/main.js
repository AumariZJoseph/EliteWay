/**
 * EliteWay – Rentals & Transfers
 * Front-end demo: fleet, lightbox, gallery, form, navigation
 */

const FLEET = [
  {
    id: "toyota-corolla",
    name: "Toyota Corolla",
    meta: "5 seats · Automatic · Petrol",
    image: "/Images/corolla.jpg",
    details: ["5 passengers", "Automatic transmission", "Petrol · Full-to-full", "Bluetooth · A/C"],
  },
  {
    id: "toyota-rav4",
    name: "Toyota RAV4",
    meta: "5 seats · Automatic · SUV",
    image: "/Images/rav4.jpg",
    details: ["5 passengers", "Automatic · AWD available", "Petrol", "Extra luggage space"],
  },
  {
    id: "mercedes-e-class",
    name: "Mercedes-Benz E-Class",
    meta: "4 seats · Automatic · Executive",
    image: "/Images/benz.jpg",
    details: ["4 passengers", "Leather interior", "Executive chauffeur ready", "Premium A/C"],
  },
  {
    id: "bmw-x5",
    name: "BMW X5",
    meta: "5 seats · Automatic · Luxury SUV",
    image: "/Images/x5.jpg",
    details: ["5 passengers", "Luxury SUV", "Panoramic roof", "Ideal for VIP & families"],
  },
  {
    id: "toyota-hiace",
    name: "Toyota Hiace",
    meta: "12 seats · Manual/Auto · Van",
    image: "/Images/hiace.jpg",
    details: ["Up to 12 passengers", "Group & corporate", "Large luggage bay", "Cruise & wedding shuttles"],
  },
  {
    id: "range-rover",
    name: "Range Rover Sport",
    meta: "5 seats · Automatic · Premium",
    image: "/Images/range.jpg",
    details: ["5 passengers", "Luxury interior", "Wedding & VIP events", "Minimum age 25 for rental"],
  },
];

// --- Fleet render ---
function renderFleet() {
  const grid = document.getElementById("fleet-grid");
  const vehicleSelect = document.getElementById("vehicle");
  if (!grid) return;

  FLEET.forEach((v) => {
    const card = document.createElement("article");
    card.className = "fleet-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View details for ${v.name}`);
    card.dataset.id = v.id;
    card.innerHTML = `
      <img src="${v.image}" alt="${v.name}" width="600" height="375" loading="lazy">
      <div class="fleet-card-body">
        <h3>${v.name}</h3>
        <p class="fleet-meta">${v.meta}</p>
        <p class="fleet-hint">Click for details →</p>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(v.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(v.id);
      }
    });
    grid.appendChild(card);

    if (vehicleSelect) {
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = v.name;
      vehicleSelect.appendChild(opt);
    }
  });
}

// --- Lightbox ---
const lightbox = document.getElementById("lightbox");

function openLightbox(id) {
  const v = FLEET.find((f) => f.id === id);
  if (!v || !lightbox) return;

  document.getElementById("lightbox-img").src = v.image;
  document.getElementById("lightbox-img").alt = v.name;
  document.getElementById("lightbox-title").textContent = v.name;
  document.getElementById("lightbox-meta").textContent = v.meta;

  const detailsEl = document.getElementById("lightbox-details");
  detailsEl.innerHTML = v.details.map((d) => `<li>${d}</li>`).join("");

  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
}

if (lightbox) {
  lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.querySelector(".lightbox-cta")?.addEventListener("click", closeLightbox);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && !lightbox.classList.contains("hidden")) {
    closeLightbox();
  }
});

// --- Hero background carousel ---
let heroIndex = 0;
const heroSlides = document.querySelectorAll(".hero-slide");

function setHeroSlide(index) {
  if (!heroSlides.length) return;
  heroIndex = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((s, i) => s.classList.toggle("active", i === heroIndex));
}

if (heroSlides.length > 1) {
  setInterval(() => setHeroSlide(heroIndex + 1), 6000);
}

// --- Premium gallery ---
let galleryIndex = 0;
const slides = document.querySelectorAll(".gallery-slide");
const dots = document.querySelectorAll(".gallery-dots .dot");

function setGallerySlide(index) {
  if (!slides.length) return;
  galleryIndex = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === galleryIndex));
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === galleryIndex);
    d.setAttribute("aria-selected", i === galleryIndex ? "true" : "false");
  });
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => setGallerySlide(i));
});

if (slides.length > 1) {
  setInterval(() => setGallerySlide(galleryIndex + 1), 5000);
}

// --- Navbar ---
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle?.addEventListener("click", () => {
  const open = navMenu?.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// Active nav on scroll
const sections = document.querySelectorAll("section[id], main > section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle(
          "active",
          href === `#${id}` ||
            (id === "inquiry" && href === "#inquiry")
        );
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

document.querySelectorAll("#transfers, #premium, #rentals, #fleet, #about, #inquiry, #top").forEach((el) => {
  if (el) observer.observe(el);
});

// --- Form: service type toggles return date ---
const serviceSelect = document.getElementById("service");
const returnDateInput = document.getElementById("return-date");
const returnWrap = document.getElementById("return-date-wrap");
const dropoffWrap = document.getElementById("dropoff-wrap");

function updateFormForService() {
  const service = serviceSelect?.value;
  const isRental = service === "rental";
  const isTransfer = service === "transfer";

  if (returnDateInput) {
    returnDateInput.disabled = !isRental;
    returnDateInput.required = isRental;
    if (!isRental) {
      returnDateInput.value = "N/A";
      returnDateInput.placeholder = "N/A for transfers";
    } else {
      returnDateInput.value = "";
      returnDateInput.placeholder = "DD/MM/YYYY";
    }
  }

  if (returnWrap) returnWrap.style.opacity = isRental ? "1" : "0.65";
  if (dropoffWrap) dropoffWrap.style.display = isTransfer || service === "premium" ? "block" : "block";
}

serviceSelect?.addEventListener("change", updateFormForService);
updateFormForService();

// Date format helper
function isValidDate(str) {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1;
}

// --- Form submit ---
const form = document.getElementById("inquiry-form");
const formSuccess = document.getElementById("form-success");
const successDetail = document.getElementById("success-detail");
const newRequestBtn = document.getElementById("new-request");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const pickupDate = document.getElementById("pickup-date");
  const returnDate = document.getElementById("return-date");
  let valid = true;

  [pickupDate, returnDate].forEach((el) => {
    if (!el || el.disabled) return;
    const val = el.value.trim();
    if (el.required && val && val !== "N/A" && !isValidDate(val)) {
      el.classList.add("invalid");
      valid = false;
    } else {
      el.classList.remove("invalid");
    }
  });

  if (!form.checkValidity() || !valid) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const vehicleName =
    FLEET.find((f) => f.id === data.vehicle)?.name || "No preference";

  form.classList.add("hidden");
  formSuccess?.classList.remove("hidden");

  if (successDetail) {
    successDetail.textContent = `Demo: Request logged for ${data.fullname} — ${data.service} on ${data["pickup-date"]}${data.vehicle ? ` · ${vehicleName}` : ""}.`;
  }

  // Simulated auto-reply (console + could show toast)
  console.info(
    "[EliteWay Demo Auto-Reply]",
    `We received your request. A coordinator will respond within 5 hours. Sent to ${data.email}.`
  );
});

newRequestBtn?.addEventListener("click", () => {
  form?.reset();
  updateFormForService();
  form?.classList.remove("hidden");
  formSuccess?.classList.add("hidden");
  form?.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
});

// Init
document.addEventListener("DOMContentLoaded", renderFleet);
