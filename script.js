"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ================================
     Mobile navigation
  ================================ */
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  /* ================================
     Scroll reveal animations
  ================================ */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ================================
     Animated impact counters
  ================================ */
  const counters = document.querySelectorAll(".counter");
  const impactSection = document.querySelector(".impact");

  let countersStarted = false;

  function animateCounters() {
    if (countersStarted || counters.length === 0) {
      return;
    }

    countersStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);

      if (!Number.isFinite(target)) {
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1
        );

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        counter.textContent = Math.floor(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (impactSection && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    counterObserver.observe(impactSection);
  }

  /* ================================
     Animated Survey Progress Bars
  ================================ */
  const surveyCards = document.querySelectorAll(".survey-card");

  function animateSurveyBars(card) {
    const bars = card.querySelectorAll(".bar-fill");
    bars.forEach((bar) => {
      const targetWidth = bar.getAttribute("data-percentage");
      if (targetWidth) {
        bar.style.width = targetWidth + "%";
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const surveyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSurveyBars(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    surveyCards.forEach((card) => {
      surveyObserver.observe(card);
    });
  } else {
    surveyCards.forEach((card) => {
      animateSurveyBars(card);
    });
  }

  /* ================================
     Testimonial slider
  ================================ */
  const testimonials = document.querySelectorAll(".testimonial");
  const dotsContainer = document.querySelector(".slider-dots");
  const previousButton = document.querySelector(".previous");
  const nextButton = document.querySelector(".next");
  const testimonialSlider = document.querySelector(".testimonial-slider");

  let currentSlide = 0;
  let sliderInterval = null;

  function showSlide(index) {
    if (testimonials.length === 0) {
      return;
    }

    currentSlide =
      (index + testimonials.length) % testimonials.length;

    testimonials.forEach((testimonial, testimonialIndex) => {
      testimonial.classList.toggle(
        "active",
        testimonialIndex === currentSlide
      );
    });

    document.querySelectorAll(".slider-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === currentSlide
      );
    });
  }

  if (testimonials.length > 0) {
    /* Create slider dots */
    if (dotsContainer) {
      testimonials.forEach((_, index) => {
        const dot = document.createElement("button");

        dot.className = "slider-dot";
        dot.type = "button";
        dot.setAttribute(
          "aria-label",
          `Show testimonial ${index + 1}`
        );

        dot.addEventListener("click", () => {
          showSlide(index);
        });

        dotsContainer.appendChild(dot);
      });
    }

    /* Previous button */
    if (previousButton) {
      previousButton.addEventListener("click", () => {
        showSlide(currentSlide - 1);
      });
    }

    /* Next button */
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        showSlide(currentSlide + 1);
      });
    }

    showSlide(0);

    /* Automatic rotation */
    function startSlider() {
      if (testimonials.length <= 1) {
        return;
      }

      clearInterval(sliderInterval);

      sliderInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 6000);
    }

    function stopSlider() {
      clearInterval(sliderInterval);
    }

    if (testimonialSlider) {
      testimonialSlider.addEventListener("mouseenter", stopSlider);
      testimonialSlider.addEventListener("mouseleave", startSlider);
    }

    startSlider();
  }

  /* ================================
     Contact form validation
  ================================ */
  const contactForm = document.querySelector("#contactForm");
  const successMessage = document.querySelector(".form-success");

  function showError(field, message) {
    if (!field) {
      return;
    }

    const errorElement =
      field.parentElement?.querySelector(".error-message");

    field.classList.add("invalid");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(field) {
    if (!field) {
      return;
    }

    const errorElement =
      field.parentElement?.querySelector(".error-message");

    field.classList.remove("invalid");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#name");
      const email = document.querySelector("#email");
      const organization = document.querySelector("#organization");
      const message = document.querySelector("#message");

      const fields = [name, email, organization, message];

      let formIsValid = true;

      fields.forEach(clearError);

      if (successMessage) {
        successMessage.classList.remove("visible");
        successMessage.textContent = "";
      }

      if (!name || name.value.trim().length < 2) {
        showError(name, "Please enter your full name.");
        formIsValid = false;
      }

      if (!email || !isValidEmail(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        formIsValid = false;
      }

      if (!organization || organization.value.trim().length < 2) {
        showError(organization, "Please enter your organization.");
        formIsValid = false;
      }

      if (!message || message.value.trim().length < 10) {
        showError(message, "Please enter at least 10 characters.");
        formIsValid = false;
      }

      if (!formIsValid) {
        return;
      }

      if (successMessage) {
        successMessage.textContent =
          "Thank you for reaching out. Your message has been received.";

        successMessage.classList.add("visible");
      }

      contactForm.reset();
    });

    /* Remove errors as users correct fields */
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        clearError(field);
      });
    });
  }

  /* ================================
     Footer year
  ================================ */
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});