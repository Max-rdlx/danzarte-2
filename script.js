/* ============================================================
   DANZARTE — Dance & Art Studio Fitness
   script.js — Navegación, WhatsApp, galería y animaciones.
   ------------------------------------------------------------
   DATOS COMERCIALES CENTRALIZADOS:
   Para actualizar teléfono o mensajes, modifica solo este objeto.
   ============================================================ */
const BUSINESS = {
  phone: "524775659627", // WhatsApp en formato internacional (52 = México)
  generalMessage: "Hola, me interesa conocer más sobre DanzArte Dance & Art Studio Fitness. ¿Podrían compartirme información?",
  scheduleMessage: "Hola, quisiera conocer más sobre los horarios y las clases disponibles.",
  packageMessage: "Hola, me interesa el paquete %s de DanzArte. ¿Podrían darme más información?",
  individualMessage: "Hola, quisiera información sobre cómo asistir a una clase individual.",
  classMessage: "Hola, quisiera conocer más sobre %s y sus horarios disponibles."
};

/** Construye la URL de WhatsApp con mensaje precargado. */
function waUrl(message) {
  return `https://wa.me/${BUSINESS.phone}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Enlaces de WhatsApp ---------- */
  // Consulta general
  document.querySelectorAll(".wa-general").forEach((el) => {
    el.setAttribute("href", waUrl(BUSINESS.generalMessage));
  });
  // Consulta por disciplina (usa data-class="Nombre de la clase")
  document.querySelectorAll(".wa-class").forEach((el) => {
    const cls = el.getAttribute("data-class") || "danza";
    el.setAttribute("href", waUrl(BUSINESS.classMessage.replace("%s", cls)));
  });
  document.querySelectorAll(".wa-schedule").forEach((el) => {
    el.setAttribute("href", waUrl(BUSINESS.scheduleMessage));
  });
  document.querySelectorAll(".wa-package").forEach((el) => {
    const packageName = el.getAttribute("data-package") || "un paquete mensual";
    el.setAttribute("href", waUrl(BUSINESS.packageMessage.replace("%s", packageName)));
  });
  document.querySelectorAll(".wa-individual").forEach((el) => {
    el.setAttribute("href", waUrl(BUSINESS.individualMessage));
  });

  /* ---------- 2. Header con efecto sticky ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Menú hamburguesa ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  const closeMenu = () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Cerrar al hacer clic en un enlace del menú móvil
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  // Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav.classList.contains("open")) closeMenu();
  });

  /* ---------- 4. Enlace activo según sección visible ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- 5. Animaciones de entrada (reveal) ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 6. Galería con lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const lbClose = document.getElementById("lightboxClose");
  const lbPrev = document.getElementById("lightboxPrev");
  const lbNext = document.getElementById("lightboxNext");
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const full = item.getAttribute("href");
    const img = item.querySelector("img");
    lbImg.src = full;
    lbImg.alt = img ? img.alt : "";
    lbCaption.textContent = item.getAttribute("data-caption") || "";
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => showImage(currentIndex - 1));
  lbNext.addEventListener("click", () => showImage(currentIndex + 1));

  // Cerrar al clic en fondo
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  /* ---------- 7. Fallback de imágenes provisionales ---------- */
  // Si una imagen externa no carga, se muestra un fondo degradado de marca
  // para mantener la composición hasta reemplazarla por fotografía real.
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("img-fallback");
      img.removeAttribute("src");
    }, { once: true });
  });

  /* ---------- 8. Año dinámico en el footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});