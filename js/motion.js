/* global gsap, ScrollTrigger */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  if (params.get("cmsEmbed") === "1") return; // avoid fighting the CMS embed script

  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Hero entrance (safe: animates wrappers, not editable text nodes)
  (function heroIntro() {
    var hero = document.querySelector("[data-section=\"hero\"]");
    if (!hero) return;
    var overlay = hero.querySelector(".hero__overlay");
    var content = hero.querySelector(".hero__content");
    var media = hero.querySelector(".hero__video-wrap");

    gsap.set([content], { opacity: 1 });
    gsap.fromTo(content, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.05, ease: "power3.out", delay: 0.1 });
    if (overlay) gsap.fromTo(overlay, { opacity: 1 }, { opacity: 0.86, duration: 1.2, ease: "power2.out" });
    if (media) gsap.fromTo(media, { scale: 1.04 }, { scale: 1, duration: 1.4, ease: "power3.out" });

    if (window.ScrollTrigger && media) {
      gsap.to(media, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  })();

  // Smooth-ish section reveal replacing CSS observer (keeps CSS working too)
  (function reveal() {
    if (!window.ScrollTrigger) return;
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-anim]"));
    if (!els.length) return;

    els.forEach(function (el) {
      // Don't override CMS transforms; animate using CSS variables via translateY only
      // If user moved an element via CMS, it will set --cms-translate and transform.
      // So we animate a light opacity + filter only on the element itself.
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      });
      el.classList.add("is-visible"); // keep CSS consistent
    });
  })();

  // Pointer glow on cards (purely visual)
  (function cardGlow() {
    var cards = document.querySelectorAll(".menu-card, .testimonial-card, .dish, .faq-card");
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = clamp((e.clientX - r.left) / r.width, 0, 1);
        var y = clamp((e.clientY - r.top) / r.height, 0, 1);
        card.style.setProperty("--mx", (x * 100).toFixed(2) + "%");
        card.style.setProperty("--my", (y * 100).toFixed(2) + "%");
      }, { passive: true });
    });
  })();
})();

