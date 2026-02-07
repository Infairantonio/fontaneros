/* =========================================================
   script.js — Fontanería Raúl (ordenado + fácil de buscar)
   ---------------------------------------------------------
   CONTENIDO:
   0) Utilidad: onReady (DOM listo)
   1) Menú móvil (Drawer accesible)
   2) Footer: año automático
   3) Formulario -> WhatsApp
   4) Scroll reveal (pasos del proceso)
   5) Typewriter (texto “máquina de escribir” en el hero)
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     0) READY (asegura que el DOM exista)
     ========================================================= */
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    /* =========================================================
       1) MENÚ MÓVIL (Drawer accesible)
       - Abre/cierra
       - ESC para cerrar
       - Click overlay / data-close
       - Cierra al pulsar enlaces internos (#seccion)
       - Trap de foco (TAB)
       - Bloqueo scroll del body
       - Auto-cierre al pasar a escritorio (>= 768px)
       ========================================================= */
    const btnMenu = document.getElementById("btnMenu");
    const drawer = document.getElementById("menuMovil");

    // Si no existen, es que IDs o script no están bien enlazados
    if (!btnMenu || !drawer) {
      console.warn(
        "No se encontró #btnMenu o #menuMovil. Revisa IDs y que script.js cargue."
      );
      // No hacemos return de todo, por si el resto (year, form, etc.) sí existe
    } else {
      const focusablesSelector =
        "a[href], button:not([disabled]), input, textarea, select, summary, [tabindex]:not([tabindex='-1'])";

      let lastFocused = null;

      const isOpen = () => btnMenu.getAttribute("aria-expanded") === "true";

      const openDrawer = () => {
        lastFocused = document.activeElement;

        // Mostrar
        drawer.hidden = false;

        // Forzar reflow para que la animación arranque siempre bien
        // eslint-disable-next-line no-unused-expressions
        drawer.offsetHeight;

        drawer.classList.add("is-open");
        btnMenu.classList.add("is-open");
        btnMenu.setAttribute("aria-expanded", "true");
        document.body.classList.add("is-locked");

        // Foco al primer elemento del drawer (accesibilidad)
        const firstFocusable = drawer.querySelector(focusablesSelector);
        if (firstFocusable) firstFocusable.focus();
      };

      const closeDrawer = () => {
        drawer.classList.remove("is-open");
        btnMenu.classList.remove("is-open");
        btnMenu.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");

        // Ocultar tras animación (200ms = lo que tienes en CSS)
        window.setTimeout(() => {
          drawer.hidden = true;
        }, 200);

        // Volver foco al último elemento activo o al botón
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus();
        } else {
          btnMenu.focus();
        }
      };

      // Toggle botón
      btnMenu.addEventListener("click", () => {
        isOpen() ? closeDrawer() : openDrawer();
      });

      // Clicks dentro del drawer: overlay / botón cerrar / links internos
      drawer.addEventListener("click", (e) => {
        const t = e.target;

        // Si clic en overlay o elemento con data-close="true"
        if (t && t.dataset && t.dataset.close === "true") {
          closeDrawer();
          return;
        }

        // Si clic en link interno (#seccion) -> cierra
        const a = t.closest("a");
        if (a && a.getAttribute("href")?.startsWith("#")) {
          closeDrawer();
        }
      });

      // Teclado: ESC para cerrar + trap TAB
      document.addEventListener("keydown", (e) => {
        // Si está oculto, no hacemos nada
        if (drawer.hidden) return;

        // ESC
        if (e.key === "Escape") {
          closeDrawer();
          return;
        }

        // Trap TAB
        if (e.key !== "Tab") return;

        const focusables = Array.from(drawer.querySelectorAll(focusablesSelector)).filter(
          (el) => el.offsetParent !== null // visibles
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

      // Si se pasa a desktop, cerramos el drawer (pro)
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

        // ⚠️ Pon aquí el WhatsApp real en formato internacional (España: 34...)
        const phone = "34600000000";

        const url = `https://wa.me/${phone}?text=${texto}`;
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    /* =========================================================
       4) SCROLL REVEAL: Pasos (visible en móviles)
       - Añade .is-visible cuando el step entra en pantalla
       - Fallback: si no hay IntersectionObserver, muestra todo
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
                obs.unobserve(entry.target); // solo una vez
              }
            });
          },
          { threshold: 0.25 }
        );

        steps.forEach((step) => io.observe(step));
      }
    }

    /* =========================================================
       5) TYPEWRITER (texto “máquina de escribir” en el hero)
       - Requiere: <span id="typewriter"></span>
       - Escribe, pausa, borra y rota frases
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

        // Escribiendo
        if (!isDeleting) {
          typeEl.textContent = current.slice(0, charIndex++);
          if (charIndex > current.length) {
            isDeleting = true;
            deletePause = true; // pausa antes de borrar
          }
        }
        // Borrando
        else {
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

        // Velocidades
        const speed = isDeleting ? 40 : 65;
        setTimeout(typeEffect, speed);
      };

      typeEffect();
    }
  });
})();
