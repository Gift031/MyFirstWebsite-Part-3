/*
  script.js
  Site-wide behaviour that every page uses:
    1. Mobile menu toggle
    2. Fade-in animation as sections scroll into view
    3. Back-to-top button
    4. Accordion (FAQ)
    5. Image gallery with lightbox
    6. Share links in the footer

  Each feature checks that its markup exists before it does anything, so one
  file can serve all five pages. Without JavaScript the pages still work:
  the menu is a plain list, FAQ answers stay open and gallery images link
  to the full-size file.
*/
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Mobile menu toggle ---------- */
  function initNav() {
    var nav = doc.querySelector("header nav");
    var list = nav && nav.querySelector("ul");
    if (!list) return;

    list.id = list.id || "primary-nav";

    var button = doc.createElement("button");
    button.type = "button";
    button.className = "nav-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", list.id);
    button.textContent = "Menu";
    nav.insertBefore(button, list);

    function setOpen(open) {
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Close menu" : "Menu";
      list.classList.toggle("is-open", open);
    }

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    list.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && list.classList.contains("is-open")) {
        setOpen(false);
        button.focus();
      }
    });
  }

  /* ---------- 2. Fade-in on scroll ---------- */
  function initReveal() {
    var selector = [
      "main > section",
      ".highlights li",
      ".team li",
      ".service",
      ".location",
      ".gallery-grid li"
    ].join(",");
    var items = doc.querySelectorAll(selector);
    if (!items.length) return;

    items.forEach(function (item, index) {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", (index % 3) * 80 + "ms");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- 3. Back-to-top button ---------- */
  function initBackToTop() {
    var button = doc.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Back to top");
    button.textContent = "\u2191 Top";
    button.hidden = true;
    doc.body.appendChild(button);

    var ticking = false;
    function update() {
      button.hidden = (window.pageYOffset || root.scrollTop) < 500;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var skip = doc.querySelector(".skip-link");
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  /* ---------- 4. Accordion ---------- */
  function initAccordions() {
    doc.querySelectorAll("[data-accordion]").forEach(function (accordion) {
      var triggers = Array.prototype.slice.call(
        accordion.querySelectorAll(".accordion-trigger")
      );

      function setState(trigger, open) {
        var panel = doc.getElementById(trigger.getAttribute("aria-controls"));
        if (!panel) return;
        trigger.setAttribute("aria-expanded", String(open));
        panel.classList.toggle("is-open", open);
      }

      triggers.forEach(function (trigger) {
        setState(trigger, false);

        trigger.addEventListener("click", function () {
          var willOpen = trigger.getAttribute("aria-expanded") !== "true";
          if (willOpen && accordion.hasAttribute("data-single")) {
            triggers.forEach(function (other) {
              setState(other, false);
            });
          }
          setState(trigger, willOpen);
        });
      });

      // Arrow keys, Home and End move focus between the questions.
      accordion.addEventListener("keydown", function (event) {
        var index = triggers.indexOf(doc.activeElement);
        if (index === -1) return;
        var next = null;
        if (event.key === "ArrowDown") next = (index + 1) % triggers.length;
        if (event.key === "ArrowUp") next = (index - 1 + triggers.length) % triggers.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = triggers.length - 1;
        if (next !== null) {
          event.preventDefault();
          triggers[next].focus();
        }
      });
    });
  }

  /* ---------- 5. Gallery lightbox ---------- */
  function initLightbox() {
    var links = Array.prototype.slice.call(doc.querySelectorAll("[data-lightbox]"));
    if (!links.length) return;

    var overlay = doc.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image viewer");

    var figure = doc.createElement("figure");
    var image = doc.createElement("img");
    image.alt = "";
    var caption = doc.createElement("figcaption");
    figure.appendChild(image);
    figure.appendChild(caption);

    function makeButton(className, label, text) {
      var button = doc.createElement("button");
      button.type = "button";
      button.className = "lightbox-button " + className;
      button.setAttribute("aria-label", label);
      button.textContent = text;
      return button;
    }
    var closeButton = makeButton("lightbox-close", "Close image viewer", "\u00D7");
    var prevButton = makeButton("lightbox-prev", "Previous image", "\u2039");
    var nextButton = makeButton("lightbox-next", "Next image", "\u203A");

    overlay.appendChild(closeButton);
    overlay.appendChild(prevButton);
    overlay.appendChild(figure);
    overlay.appendChild(nextButton);
    doc.body.appendChild(overlay);

    var current = 0;
    var lastFocused = null;

    function show(index) {
      current = (index + links.length) % links.length;
      var link = links[current];
      var thumb = link.querySelector("img");
      image.src = link.getAttribute("href");
      image.alt = thumb ? thumb.alt : "";
      caption.textContent =
        (link.getAttribute("data-caption") || (thumb ? thumb.alt : "")) +
        "  (" + (current + 1) + " of " + links.length + ")";
    }

    function open(index) {
      lastFocused = doc.activeElement;
      show(index);
      overlay.hidden = false;
      doc.body.classList.add("no-scroll");
      closeButton.focus();
    }

    function close() {
      overlay.hidden = true;
      doc.body.classList.remove("no-scroll");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    links.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        open(index);
      });
    });

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", function () { show(current - 1); });
    nextButton.addEventListener("click", function () { show(current + 1); });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) close();
    });

    doc.addEventListener("keydown", function (event) {
      if (overlay.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
      if (event.key === "Tab") {
        // Keep keyboard focus inside the dialog while it is open.
        var stops = [closeButton, prevButton, nextButton];
        var position = stops.indexOf(doc.activeElement);
        event.preventDefault();
        var step = event.shiftKey ? -1 : 1;
        stops[(position + step + stops.length) % stops.length].focus();
      }
    });
  }

  /* ---------- 6. Share links ---------- */
  function initShare() {
    var canonical = doc.querySelector('link[rel="canonical"]');
    var url = canonical ? canonical.href : window.location.href;
    var text = doc.title;

    doc.querySelectorAll("[data-share]").forEach(function (link) {
      var network = link.getAttribute("data-share");
      if (network === "whatsapp") {
        link.href = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
      } else if (network === "facebook") {
        link.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
      } else if (network === "email") {
        link.href =
          "mailto:?subject=" + encodeURIComponent(text) +
          "&body=" + encodeURIComponent("Have a look at this: " + url);
      }
    });
  }

  function start() {
    initNav();
    initReveal();
    initBackToTop();
    initAccordions();
    initLightbox();
    initShare();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
