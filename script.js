// Skill Radar (reintroduced) -------------------------------------------------
function initSkillRadar() {
  const svg = document.getElementById("skill-radar");
  if (!svg) return; // guard

  const center = { x: 160, y: 160 };
  const radius = 135;
  const levels = 5; // concentric hex rings
  // Order & percentages aligned with reference (approximate visually):
  // NLP ~85, Computer Vision ~80, MLOps ~90, Data Engineering ~72, Deep Learning ~88, LLMs ~78
  const skills = [
    { label: "NLP", value: 85 },
    { label: "Computer Vision", value: 80 },
    { label: "MLOps", value: 90 },
    { label: "Data Engineering", value: 72 },
    { label: "Deep Learning", value: 88 },
    { label: "LLMs", value: 78 },
  ];

  const gridGroup = svg.querySelector("#radar-grid");
  const polygon = svg.querySelector("#radar-polygon");
  const outline = svg.querySelector("#radar-outline");
  const pointsGroup = svg.querySelector("#radar-points");
  const labelsGroup = svg.querySelector("#radar-labels");

  // Utility: build hex path for given radius
  function hexPath(r) {
    let d = "";
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + i * ((Math.PI * 2) / 6);
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return d + " Z";
  }
  // Build concentric hex level rings
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "path");
    ring.setAttribute("class", "level-ring");
    ring.setAttribute("d", hexPath(r));
    gridGroup.appendChild(ring);
  }

  // Axis lines & compute points (6 axes for hex)
  const angleSlice = (Math.PI * 2) / skills.length;
  const points = skills.map((skill, i) => {
    const angle = -Math.PI / 2 + i * angleSlice; // start at top
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "axis-line");
    line.setAttribute("x1", center.x);
    line.setAttribute("y1", center.y);
    line.setAttribute("x2", (center.x + Math.cos(angle) * radius).toFixed(2));
    line.setAttribute("y2", (center.y + Math.sin(angle) * radius).toFixed(2));
    gridGroup.appendChild(line);

    const valueRadius = (skill.value / 100) * radius;
    return {
      x: center.x + Math.cos(angle) * valueRadius,
      y: center.y + Math.sin(angle) * valueRadius,
      label: skill.label,
      value: skill.value,
      angle,
    };
  });

  function buildPolygonPath(scaleFactor = 1) {
    return (
      points
        .map((p, i) => {
          const sx = center.x + (p.x - center.x) * scaleFactor;
          const sy = center.y + (p.y - center.y) * scaleFactor;
          return `${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)}`;
        })
        .join(" ") + " Z"
    );
  }

  // Initial collapsed state for intro animation
  polygon.setAttribute("d", buildPolygonPath(0));
  outline.setAttribute("d", buildPolygonPath(0));

  // Labels only (points optional, minimal)
  points.forEach((p) => {
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const labelRadius = radius + 28; // push labels outward a bit more
    const lx = center.x + Math.cos(p.angle) * labelRadius;
    const ly = center.y + Math.sin(p.angle) * labelRadius;
    label.setAttribute("x", lx.toFixed(2));
    label.setAttribute("y", ly.toFixed(2));
    label.setAttribute(
      "text-anchor",
      Math.cos(p.angle) > 0.45
        ? "start"
        : Math.cos(p.angle) < -0.45
        ? "end"
        : "middle"
    );
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = p.label;
    labelsGroup.appendChild(label);
  });

  // Intro animation (expand polygon & grow points)
  const duration = 1300;
  const start = performance.now();
  function animateIntro(t) {
    const elapsed = t - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress; // easeInOutQuad
    const path = buildPolygonPath(ease);
    polygon.setAttribute("d", path);
    outline.setAttribute("d", path);
    // no point expansion now
    if (progress < 1) requestAnimationFrame(animateIntro);
  }
  requestAnimationFrame(animateIntro);

  // Edge pulse: animate polygon stroke opacity & width
  function edgePulse() {
    let last = performance.now();
    function frame(t) {
      const dt = (t - last) / 1000;
      last = t;
      const pulse = (Math.sin(t / 900) + 1) / 2; // 0..1
      const w = 1.2 + pulse * 1.4;
      outline.style.strokeWidth = w.toFixed(2);
      outline.style.opacity = (0.35 + pulse * 0.45).toFixed(3);
      polygon.style.fillOpacity = (0.15 + pulse * 0.12).toFixed(3);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  edgePulse();
}
document.addEventListener("DOMContentLoaded", initSkillRadar);

// jQuery dependent UI logic
$(document).ready(function () {
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

  // Expand/collapse functionality for projects and publications (robust version)
  // Markup patterns:
  //  - Publications: button.view-more-toggle is sibling of span.summary and .view-more-content directly inside .publication-summary
  //  - Projects: button.view-more-toggle inside .button-row; .view-more-content is sibling of .project-summary (descendant of article.project)
  // Initial hide to prevent flash
  $(".view-more-content").hide();
  $(".view-more-toggle").attr({
    "aria-expanded": "false",
    "aria-controls": "",
  });
  $(document).on("click", ".view-more-toggle", function () {
    const $btn = $(this);
    let $container = $btn.closest(
      ".publication, .project, .publication-summary, .project-summary"
    );
    if (!$container.length) return;

    // For button inside .button-row inside .project-summary, we want the summary container
    if ($container.hasClass("project") || $container.hasClass("publication")) {
      $container = $container
        .find(".project-summary, .publication-summary")
        .first();
    }
    const $content = $container.find("> .view-more-content");
    if (!$content.length) return;

    const expanded = $content.is(":visible");
    if (expanded) {
      $content.stop(true, true).slideUp(220, () => {
        $content.removeClass("expanded");
      });
      $btn.html('View more <span class="arrow">▼</span>');
      $btn.attr("aria-expanded", "false");
    } else {
      $content.stop(true, true).slideDown(260, () => {
        $content.addClass("expanded");
      });
      $btn.html('View less <span class="arrow">▲</span>');
      $btn.attr("aria-expanded", "true");
    }
  });
}); // end jQuery ready block

// Sequential neural network animation with gentle bounce and glimmer
function sequentialNeuralPulse() {
  const nodeGroups = document.querySelectorAll("#neural-svg .nn-node-group");
  if (!nodeGroups.length) return;

  let currentNode = 0;
  const pulseInterval = 800; // ms between pulses
  const pulseDuration = 1200; // ms for each bounce and glimmer

  function activateNode(index) {
    if (index >= nodeGroups.length) return;

    const group = nodeGroups[index];
    const node = group.querySelector(".nn-node");
    const glow = group.querySelector(".nn-node-glow");

    if (!node || !glow) return;

    // Reset any previous animations
    node.style.transform = "";
    node.style.filter = "";
    glow.style.opacity = "0";

    // Gentle bounce with glimmer animation
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / pulseDuration, 1);

      if (progress < 1) {
        // Gentle bounce effect (smoother, calmer)
        const bouncePhase =
          Math.sin(progress * Math.PI * 2) * Math.exp(-progress * 3);
        const scale = 1 + bouncePhase * 0.15; // More subtle bounce

        // Glimmer effect with smooth glow
        const glimmerPhase = Math.sin(progress * Math.PI * 1.5);
        const glowOpacity = glimmerPhase * 0.6;
        const brightness = 1 + glimmerPhase * 0.4;

        // Apply gentle transform and glimmer
        node.style.transform = `scale(${scale})`;
        node.style.transformOrigin = "center";
        node.style.filter = `brightness(${brightness})`;
        glow.style.opacity = Math.max(0, glowOpacity);

        requestAnimationFrame(animate);
      } else {
        // Fade out smoothly
        node.style.transform = "";
        node.style.filter = "";
        glow.style.opacity = "0";
      }
    }

    requestAnimationFrame(animate);
  }

  function sequentialActivation() {
    // Group nodes by layer for proper sequencing
    const layers = [];
    nodeGroups.forEach((group) => {
      const layer = parseInt(group.dataset.layer) || 0;
      if (!layers[layer]) layers[layer] = [];
      layers[layer].push(group);
    });

    let totalDelay = 0;

    layers.forEach((layerNodes, layerIndex) => {
      layerNodes.forEach((group, nodeIndex) => {
        const nodeIdx = Array.from(nodeGroups).indexOf(group);
        setTimeout(() => activateNode(nodeIdx), totalDelay);
        totalDelay += 200; // Stagger within layer
      });
      totalDelay += 400; // Extra delay between layers for calmer effect
    });
  }

  // Start sequence and repeat
  sequentialActivation();
  setInterval(sequentialActivation, 5000); // Slower repeat for calmness
}
document.addEventListener("DOMContentLoaded", sequentialNeuralPulse);

function animateSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  let animated = false;
  function checkAndAnimate() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const shouldAnimate =
      isVisible ||
      skillsSection.classList.contains("active") ||
      skillsSection.style.opacity === "1";
    if (shouldAnimate && !animated) {
      bars.forEach((bar) => {
        const skill = bar.getAttribute("data-skill");
        bar.style.width = skill + "%";
      });
      animated = true;
    } else if (!shouldAnimate && animated) {
      bars.forEach((bar) => {
        bar.style.width = "0";
      });
      animated = false;
    }
  }
  window.addEventListener("scroll", checkAndAnimate);
  window.addEventListener("resize", checkAndAnimate);
  setInterval(checkAndAnimate, 500); // fallback for edge cases
  checkAndAnimate();
}
document.addEventListener("DOMContentLoaded", animateSkillBars);

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
    const texts = ["AI engineer", "ML engineer"];
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

// Timeline auto-highlight previously removed was reintroduced in enhanced form further below.

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

// Timeline auto-highlight & progress bar removed per user request.
