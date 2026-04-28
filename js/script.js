/* =========================================================
   script.js — Fontanería Raúl
   ---------------------------------------------------------
   CONTENIDO:
   0) Utilidad: onReady
   1) Menú móvil
   2) Footer: año automático
   3) Formulario -> WhatsApp
   4) Scroll reveal
   5) Typewriter
   6) Cookies / consentimiento legal
   ========================================================= */

(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    /* =========================================================
       1) MENÚ MÓVIL
       ========================================================= */
    const btnMenu = document.getElementById("btnMenu");
    const drawer = document.getElementById("menuMovil");

    if (!btnMenu || !drawer) {
      console.warn("No se encontró #btnMenu o #menuMovil.");
    } else {
      const focusablesSelector =
        "a[href], button:not([disabled]), input, textarea, select, summary, [tabindex]:not([tabindex='-1'])";

      let lastFocused = null;

      const isOpen = () => btnMenu.getAttribute("aria-expanded") === "true";

      const openDrawer = () => {
        lastFocused = document.activeElement;
        drawer.hidden = false;
        drawer.offsetHeight;

        drawer.classList.add("is-open");
        btnMenu.classList.add("is-open");
        btnMenu.setAttribute("aria-expanded", "true");
        document.body.classList.add("is-locked");

        const firstFocusable = drawer.querySelector(focusablesSelector);
        if (firstFocusable) firstFocusable.focus();
      };

      const closeDrawer = () => {
        drawer.classList.remove("is-open");
        btnMenu.classList.remove("is-open");
        btnMenu.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");

        window.setTimeout(() => {
          drawer.hidden = true;
        }, 200);

        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus();
        } else {
          btnMenu.focus();
        }
      };

      btnMenu.addEventListener("click", () => {
        isOpen() ? closeDrawer() : openDrawer();
      });

      drawer.addEventListener("click", (e) => {
        const t = e.target;

        if (t && t.dataset && t.dataset.close === "true") {
          closeDrawer();
          return;
        }

        const a = t.closest("a");
        if (a && a.getAttribute("href")?.startsWith("#")) {
          closeDrawer();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (drawer.hidden) return;

        if (e.key === "Escape") {
          closeDrawer();
          return;
        }

        if (e.key !== "Tab") return;

        const focusables = Array.from(drawer.querySelectorAll(focusablesSelector)).filter(
          (el) => el.offsetParent !== null
        );

        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && !drawer.hidden) closeDrawer();
      });
    }

    /* =========================================================
       2) FOOTER: Año automático
       ========================================================= */
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* =========================================================
       3) FORM -> WhatsApp
       ========================================================= */
    const form = document.getElementById("leadForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);

        const nombre = (data.get("nombre") || "").toString().trim();
        const telefono = (data.get("telefono") || "").toString().trim();
        const zona = (data.get("zona") || "").toString().trim();
        const mensaje = (data.get("mensaje") || "").toString().trim();

        const texto =
          `Hola, soy ${nombre}.%0A` +
          `Mi teléfono es: ${telefono}.%0A` +
          `Zona: ${zona}.%0A` +
          `Problema: ${mensaje || "Necesito un aviso de fontanería."}`;

        const phone = "34600000000";
        const url = `https://wa.me/${phone}?text=${texto}`;

        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    /* =========================================================
       4) SCROLL REVEAL
       ========================================================= */
    const steps = document.querySelectorAll(".step--reveal");
    if (steps.length) {
      if (!("IntersectionObserver" in window)) {
        steps.forEach((el) => el.classList.add("is-visible"));
      } else {
        const io = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.25 }
        );

        steps.forEach((step) => io.observe(step));
      }
    }

    /* =========================================================
       5) TYPEWRITER
       ========================================================= */
    const typeEl = document.getElementById("typewriter");
    if (typeEl) {
      const texts = [
        "Urgencias, desatascos, fugas y reparaciones.",
        "Atención directa por teléfono o WhatsApp.",
        "Presupuesto claro y trabajo limpio.",
      ];

      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let deletePause = false;

      const typeEffect = () => {
        const current = texts[textIndex];

        if (!isDeleting) {
          typeEl.textContent = current.slice(0, charIndex++);
          if (charIndex > current.length) {
            isDeleting = true;
            deletePause = true;
          }
        } else {
          if (deletePause) {
            deletePause = false;
            setTimeout(typeEffect, 1400);
            return;
          }

          typeEl.textContent = current.slice(0, charIndex--);
          if (charIndex <= 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
          }
        }

        const speed = isDeleting ? 40 : 65;
        setTimeout(typeEffect, speed);
      };

      typeEffect();
    }

    /* =========================================================
       6) COOKIES / CONSENTIMIENTO LEGAL
       ========================================================= */
    const cookieBanner = document.getElementById("cookieBanner");
    const cookieModal = document.getElementById("cookieModal");

    const acceptCookies = document.getElementById("acceptCookies");
    const rejectCookies = document.getElementById("rejectCookies");
    const configCookies = document.getElementById("configCookies");

    const closeCookieModal = document.getElementById("closeCookieModal");
    const saveCookieConfig = document.getElementById("saveCookieConfig");
    const saveRejectCookies = document.getElementById("saveRejectCookies");
    const analyticsCookies = document.getElementById("analyticsCookies");

    const CONSENT_KEY = "fontaneria_raul_cookie_consent";

    const getConsent = () => {
      try {
        return JSON.parse(localStorage.getItem(CONSENT_KEY));
      } catch {
        return null;
      }
    };

    const saveConsent = (settings) => {
      const consent = {
        necessary: true,
        analytics: Boolean(settings.analytics),
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

      hideCookieBanner();
      closeCookiesModal();
      applyConsent(consent);
    };

    const showCookieBanner = () => {
      if (cookieBanner) cookieBanner.hidden = false;
    };

    const hideCookieBanner = () => {
      if (cookieBanner) cookieBanner.hidden = true;
    };

    const openCookiesModal = () => {
      if (!cookieModal) return;

      const currentConsent = getConsent();
      if (analyticsCookies) {
        analyticsCookies.checked = Boolean(currentConsent?.analytics);
      }

      cookieModal.hidden = false;
      document.body.classList.add("cookie-modal-open");

      const firstButton = cookieModal.querySelector("button, input, a");
      if (firstButton) firstButton.focus();
    };

    const closeCookiesModal = () => {
      if (!cookieModal) return;

      cookieModal.hidden = true;
      document.body.classList.remove("cookie-modal-open");
    };

    const applyConsent = (consent) => {
      if (!consent) return;

      if (consent.analytics) {
        enableAnalyticsCookies();
      }
    };

    const enableAnalyticsCookies = () => {
      /*
        Aquí activarías Google Analytics, Meta Pixel u otra herramienta
        SOLO después de que el usuario haya aceptado cookies de análisis.

        Ejemplo futuro:
        - cargar script de Google Analytics dinámicamente
        - cargar píxel de conversión
        - activar mapas, vídeos externos, etc.

        Ahora lo dejamos vacío porque tu web actual no necesita cookies
        de análisis para funcionar.
      */
      console.info("Cookies de análisis aceptadas. Preparado para activar Analytics si se añade.");
    };

    if (cookieBanner && cookieModal) {
      const currentConsent = getConsent();

      if (!currentConsent) {
        showCookieBanner();
      } else {
        applyConsent(currentConsent);
      }

      if (acceptCookies) {
        acceptCookies.addEventListener("click", () => {
          saveConsent({ analytics: true });
        });
      }

      if (rejectCookies) {
        rejectCookies.addEventListener("click", () => {
          saveConsent({ analytics: false });
        });
      }

      if (configCookies) {
        configCookies.addEventListener("click", openCookiesModal);
      }

      if (closeCookieModal) {
        closeCookieModal.addEventListener("click", closeCookiesModal);
      }

      if (saveCookieConfig) {
        saveCookieConfig.addEventListener("click", () => {
          saveConsent({
            analytics: analyticsCookies ? analyticsCookies.checked : false,
          });
        });
      }

      if (saveRejectCookies) {
        saveRejectCookies.addEventListener("click", () => {
          if (analyticsCookies) analyticsCookies.checked = false;
          saveConsent({ analytics: false });
        });
      }

      cookieModal.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.dataset && target.dataset.cookieClose === "true") {
          closeCookiesModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && cookieModal && !cookieModal.hidden) {
          closeCookiesModal();
        }
      });
    }
  });
})();