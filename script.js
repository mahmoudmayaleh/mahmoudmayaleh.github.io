document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".publication-summary .view-more-toggle")
    .forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        // Close all others
        document
          .querySelectorAll(".publication-summary .view-more-content.expanded")
          .forEach(function (opened) {
            if (
              opened !==
              toggle.parentElement.querySelector(".view-more-content")
            ) {
              opened.classList.remove("expanded");
              const btn =
                opened.parentElement.querySelector(".view-more-toggle");
              if (btn) {
                btn.classList.remove("expanded");
                btn.innerHTML = 'View more <span class="arrow">▼</span>';
              }
            }
          });
        // Toggle this one
        const content =
          toggle.parentElement.querySelector(".view-more-content");
        const expanded = content.classList.toggle("expanded");
        toggle.classList.toggle("expanded", expanded);
        toggle.innerHTML = expanded
          ? 'View less <span class="arrow">▲</span>'
          : 'View more <span class="arrow">▼</span>';
      });
      toggle.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle.click();
        }
      });
    });
});
// Expandable 'View more' for publication cards - only one open at a time
// This must be outside of $(document).ready() to ensure it runs properly
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".publication-summary .view-more-toggle")
    .forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        // Close all others
        document
          .querySelectorAll(".publication-summary .view-more-content.expanded")
          .forEach(function (opened) {
            if (
              opened !==
              toggle.parentElement.querySelector(".view-more-content")
            ) {
              opened.classList.remove("expanded");
              const btn =
                opened.parentElement.querySelector(".view-more-toggle");
              if (btn) {
                btn.classList.remove("expanded");
                btn.innerHTML = 'View more <span class="arrow">▼</span>';
              }
            }
          });
        // Toggle this one
        const content =
          toggle.parentElement.querySelector(".view-more-content");
        const expanded = content.classList.toggle("expanded");
        toggle.classList.toggle("expanded", expanded);
        toggle.innerHTML = expanded
          ? 'View less <span class="arrow">▲</span>'
          : 'View more <span class="arrow">▼</span>';
      });
      toggle.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle.click();
        }
      });
    });
});
$(document).ready(function () {
  $(window).scroll(function () {
    // sticky navbar on scroll script
    if (this.scrollY > 20) {
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").removeClass("sticky");
    }

    // scroll-up button show/hide script
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    particlesJS("particles-js", {
      particles: {
        number: { value: 100 },
        size: { value: 3 },
        move: { speed: 2 },
        color: { value: "#ffffff" },
        line_linked: { color: "#ffffff" },
      },
    });
  });

  window.addEventListener("scroll", function () {
    document.querySelector(".scroll-arrow").style.display =
      window.scrollY > 50 ? "none" : "block";
  });

  // slide-up script
  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });

    $("html").css("scrollBehavior", "auto");
  });

  $(".navbar .menu li a").click(function () {
    $("html").css("scrollBehavior", "smooth");
  });

  // toggle menu/navbar script
  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  // owl carousel script
  $(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    autoplay: true,
    autoplayTimeOut: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        nav: false,
      },
    },
  });

  emailjs.init("9ikn3t9V_OwCkCodC");

  $("form").submit(function (event) {
    event.preventDefault();

    $("input[name='reply_to']").val($("input[name='from_email']").val());

    emailjs.sendForm("service_brq095l", "template_sn27fo7", this).then(
      function (response) {
        console.log("Success", response);
        alert("Message sent successfully!");

        $("form")[0].reset();
      },
      function (error) {
        console.log("Error", error);
        alert("Failed to send message. Please try again.");
      }
    );
  });
});

// Neural network nodes animation
function pulseNeuralNodes() {
  const nodes = document.querySelectorAll("#neural-svg .nn-node");
  let t = 0;
  setInterval(() => {
    nodes.forEach((node, i) => {
      const scale = 1 + 0.1 * Math.sin(t + i * 0.8);
      const cx = parseFloat(node.getAttribute("cx"));
      const cy = parseFloat(node.getAttribute("cy"));
      // Center the scale transform on the node's center
      node.setAttribute(
        "transform",
        `translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`
      );
      node.style.filter = `drop-shadow(0 0 ${
        8 + 8 * Math.abs(Math.sin(t + i))
      }px #00eaff)`;
    });
    t += 0.07;
  }, 40);
}
document.addEventListener("DOMContentLoaded", pulseNeuralNodes);

function animateSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  let animated = false;
  function checkAndAnimate() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (!animated && rect.top < window.innerHeight - 100) {
      bars.forEach((bar) => {
        const skill = bar.getAttribute("data-skill");
        bar.style.width = skill + "%";
      });
      animated = true;
    }
  }
  window.addEventListener("scroll", checkAndAnimate);
  checkAndAnimate();
}
document.addEventListener("DOMContentLoaded", animateSkillBars);

document.addEventListener("DOMContentLoaded", function () {
  // Live validation for contact form fields
  const form = document.querySelector(".contact form");
  if (!form) return;

  function validateInput(input) {
    let valid = false;
    if (input.type === "email") {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else {
      valid = input.value.trim().length > 0;
    }
    input.classList.toggle("valid", valid);
    input.classList.toggle("invalid", !valid && input.value.length > 0);
  }

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => validateInput(input));
    input.addEventListener("blur", () => validateInput(input));
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Scroll reveal effect
  const reveals = document.querySelectorAll(".reveal");
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 60) {
        el.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle.querySelector("i");
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const typewriter = document.getElementById("typewriter-text");
  if (typewriter) {
    const texts = ["an AI engineer", "a ML engineer"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = texts[textIndex];
      if (!isDeleting) {
        typewriter.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(() => {
            isDeleting = true;
            type();
          }, 1400);
        } else {
          setTimeout(type, 60);
        }
      } else {
        typewriter.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, 30);
        }
      }
    }
    type();
  }
});

function highlightTimelineItems() {
  const items = document.querySelectorAll(".timeline-vertical-item");
  let found = false;
  items.forEach((item) => item.classList.remove("active"));
  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect();
    if (
      !found &&
      rect.top < window.innerHeight * 0.5 &&
      rect.bottom > window.innerHeight * 0.2
    ) {
      items[i].classList.add("active");
      found = true;
    }
  }
}
window.addEventListener("scroll", highlightTimelineItems);
window.addEventListener("load", highlightTimelineItems);

function highlightWavyTimelineItems() {
  const items = document.querySelectorAll(".timeline-wavy-item");
  let found = false;
  items.forEach((item) => item.classList.remove("active"));
  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect();
    if (
      !found &&
      rect.top < window.innerHeight * 0.5 &&
      rect.bottom > window.innerHeight * 0.2
    ) {
      items[i].classList.add("active");
      found = true;
    }
  }
}
window.addEventListener("scroll", highlightWavyTimelineItems);
window.addEventListener("load", highlightWavyTimelineItems);

//floating sparks
const createParticle = () => {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 5000);
};
setInterval(createParticle, 300);
