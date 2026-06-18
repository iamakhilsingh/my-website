(function () {
  "use strict";

  const whatsappNumber = ["91", "783", "824", "7423"].join("");
  const defaultMessage =
    "Hello MedTreat India, I would like guidance for treatment options in India.";

  function whatsappUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message || defaultMessage);
  }

  window.MedTreatIndia = Object.assign(window.MedTreatIndia || {}, {
    defaultMessage,
    whatsappUrl
  });

  function setupNavigation() {
    const button = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.setAttribute("href", whatsappUrl(defaultMessage));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function setupLanguageSelectors() {
    const slots = document.querySelectorAll("[data-language-slot]");
    if (!slots.length) return;

    const languages = [
      ["", "Select Language"],
      ["en", "English"],
      ["fr", "French"],
      ["ar", "Arabic"],
      ["ru", "Russian"],
      ["bn", "Bengali"],
      ["hi", "Hindi"],
      ["ro", "Romanian"],
      ["es", "Spanish"],
      ["pt", "Portuguese"]
    ];
    const storageKey = "medtreatindia-language";
    const savedLanguage = window.localStorage.getItem(storageKey) || "";

    function createLanguageWidget(extraClass) {
      const wrapper = document.createElement("label");
      wrapper.className = "language-widget" + (extraClass ? " " + extraClass : "");
      const label = document.createElement("span");
      label.textContent = "Language";
      wrapper.appendChild(label);

      const select = document.createElement("select");
      select.setAttribute("aria-label", "Select website language");
      select.setAttribute("data-language-select", "");
      languages.forEach(([code, text]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = text;
        select.appendChild(option);
      });
      select.value = savedLanguage;
      wrapper.appendChild(select);
      return wrapper;
    }

    slots.forEach((slot) => {
      if (!slot.querySelector("[data-language-select]")) {
        slot.appendChild(createLanguageWidget("language-widget-hero"));
      }
    });

    document.querySelectorAll("[data-language-select]").forEach((select) => {
      select.addEventListener("change", () => {
        const language = select.value;
        window.localStorage.setItem(storageKey, language);
        document.querySelectorAll("[data-language-select]").forEach((otherSelect) => {
          otherSelect.value = language;
        });
        if (!language || language === "en") return;

        const currentUrl = window.location.protocol === "file:"
          ? "https://www.medtreatindia.com/"
          : window.location.href;
        const translateUrl =
          "https://translate.google.com/translate?sl=auto&tl=" +
          encodeURIComponent(language) +
          "&u=" +
          encodeURIComponent(currentUrl);
        window.location.href = translateUrl;
      });
    });
  }

  function setupHospitalSliders() {
    document.querySelectorAll("[data-hospital-slider]").forEach((slider) => {
      const cards = Array.from(slider.querySelectorAll("article"));
      if (cards.length < 2) return;
      const showcase = slider.closest("[data-hospital-showcase]");
      const previousButton = showcase ? showcase.querySelector("[data-hospital-prev]") : null;
      const nextButton = showcase ? showcase.querySelector("[data-hospital-next]") : null;
      const slideDelay = 3000;

      let index = 0;
      let timer;

      function updateCards() {
        cards.forEach((card, cardIndex) => {
          const position = (cardIndex - index + cards.length) % cards.length;
          card.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

          if (position === 0) {
            card.classList.add("is-active");
          } else if (position === 1) {
            card.classList.add("is-next");
          } else if (position === cards.length - 1) {
            card.classList.add("is-prev");
          } else {
            card.classList.add("is-hidden");
          }
        });
      }

      function goToCard(nextIndex) {
        index = (nextIndex + cards.length) % cards.length;
        updateCards();
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function start() {
        stop();
        timer = window.setInterval(() => goToCard(index + 1), slideDelay);
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      slider.addEventListener("focusin", stop);
      slider.addEventListener("focusout", start);
      previousButton?.addEventListener("click", () => {
        stop();
        goToCard(index - 1);
        start();
      });
      nextButton?.addEventListener("click", () => {
        stop();
        goToCard(index + 1);
        start();
      });

      updateCards();
      start();
    });
  }

  function setupTestimonialVideos() {
    document.querySelectorAll("[data-youtube-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const videoId = button.getAttribute("data-youtube-id");
        if (!videoId) return;

        const iframe = document.createElement("iframe");
        iframe.className = "testimonial-video";
        iframe.src =
          "https://www.youtube-nocookie.com/embed/" +
          videoId +
          "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        iframe.title = "Mariam patient testimonial for knee and gallbladder treatment with MedTreat India";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        button.replaceWith(iframe);
      });
    });
  }

  function setupZoomReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selectors = [
      ".section-head",
      ".section > .container > *",
      ".mini-card-grid article",
      ".steps-row article",
      ".hospital-showcase",
      ".logo-marquee",
      ".testimonial-feature-card",
      ".testimonial-grid article",
      ".story-options a",
      ".treatment-directory article",
      ".security-card",
      ".content-card",
      ".image-card",
      ".cta-band h2",
      ".cta-band p",
      ".cta-band .hero-actions > *",
      ".footer-grid > *",
      ".footer-bottom",
      ".floating-wa"
    ];

    const elements = Array.from(document.querySelectorAll(selectors.join(","))).filter((element) => {
      return (
        !element.closest("[data-zoom-reveal]") &&
        !element.closest(".hero") &&
        !element.closest(".page-hero") &&
        !element.matches(".site-header, .site-header *")
      );
    });

    if (!elements.length) return;
    document.body.classList.add("zoom-reveal-ready");

    elements.forEach((element, index) => {
      element.setAttribute("data-zoom-reveal", "");
      element.classList.add("zoom-delay-" + Math.min(index % 6, 5));
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-zoom-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-zoom-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function setupThemeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const storageKey = "medtreatindia-theme";

    function preferredTheme() {
      const savedTheme = window.localStorage.getItem(storageKey);
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      return mediaQuery.matches ? "dark" : "light";
    }

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;

      if (toggle) {
        const isDark = theme === "dark";
        const label = toggle.querySelector("[data-theme-toggle-label]");
        if (label) label.textContent = isDark ? "Dark" : "Light";
        toggle.dataset.mode = theme;
        toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        toggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
        toggle.setAttribute("aria-pressed", String(isDark));
      }
    }

    applyTheme(preferredTheme());

    toggle?.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      window.localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });

    const handleSystemThemeChange = () => {
      if (!window.localStorage.getItem(storageKey)) {
        applyTheme(preferredTheme());
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  setupThemeToggle();
  setupNavigation();
  setupWhatsAppLinks();
  setupLanguageSelectors();
  setupHospitalSliders();
  setupTestimonialVideos();
  setupZoomReveal();
})();
