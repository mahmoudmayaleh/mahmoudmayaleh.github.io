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
    { label: "NLP / LLMs", value: 85 },
    { label: "Computer Vision", value: 78 },
    { label: "MLOps", value: 80 },
    { label: "RAG Systems", value: 78 },
    { label: "Deep Learning", value: 88 },
    { label: "Fed. Learning", value: 82 },
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


// typewriter replaced by CSS flip animation

// Timeline auto-highlight previously removed was reintroduced in enhanced form further below.

// Hexagon Background ----------------------------------------------------------
(function initHexBackground() {
  const gridEl = document.getElementById("hex-grid");
  if (!gridEl) return;

  const HW = 52;              // hex width  px
  const HH = HW * 1.15;      // hex height px  (≈59.8)
  const RS = HW * 0.86;      // row-step factor (≈44.72)
  const HM = 2;               // margin / border px

  // Row geometry (derived once, recomputed on resize)
  // Row 0 top  = -HH*0.25         (rows bleed off the top edge)
  // Row r top  = -HH*0.25 + r*(HH - RS*0.16)
  const ROW_STEP   = HH - RS * 0.16;   // ≈52.65 px between row tops
  const ROW_TOP_0  = -HH * 0.25;       // ≈-14.95
  const ROW_CY_0   = ROW_TOP_0 + HH / 2; // center-Y of row 0  (≈14.95)
  const COL_STEP   = HW + HM;           // 54

  // Col center-X for a given row-parity and column index:
  //   even row marginLeft = HM - HW*0.1 = -3.2  → cx = -3.2 + c*54 + HW/2 = 22.8 + c*54
  //   odd  row marginLeft = -(HW/2) + HM - HW*0.1 = -29.2 → cx = -3.2 + c*54
  function colCX(isOdd, c) {
    return isOdd ? (-3.2 + c * COL_STEP) : (22.8 + c * COL_STEP);
  }

  // ── 2-D grid of hex elements: hexGrid[row][col] ──────────────────────────
  let hexGrid  = [];
  let numRows  = 0;
  let numCols  = 0;
  let activeEl = null;

  function buildGrid() {
    gridEl.innerHTML = "";
    hexGrid = [];

    const w = window.innerWidth;
    const h = window.innerHeight;
    numCols = Math.ceil(w / HW) + 4;
    numRows = Math.ceil(h / RS) + 4;

    for (let r = 0; r < numRows; r++) {
      const isOdd = r % 2 === 1;
      const ml    = isOdd ? (-(HW / 2) + HM - HW * 0.1) : (HM - HW * 0.1);
      const mt    = r === 0 ? ROW_TOP_0 : -(RS * 0.16);

      const rowEl = document.createElement("div");
      rowEl.className = "hex-row";
      rowEl.style.cssText = `display:flex;margin-top:${mt}px;margin-left:${ml}px`;

      const rowArr = [];
      for (let c = 0; c < numCols; c++) {
        const hex = document.createElement("div");
        hex.className = "hex";
        hex.style.cssText = `width:${HW}px;height:${HH}px;margin-left:${HM}px`;
        rowEl.appendChild(hex);
        rowArr.push(hex);
      }
      gridEl.appendChild(rowEl);
      hexGrid.push(rowArr);
    }
  }

  // ── Find the hex cell under (mx, my) using grid math ─────────────────────
  // This is O(1) and works regardless of z-index / pointer-events / clip-path.
  function hexAt(mx, my) {
    // Estimate row from Y
    const rEst = Math.round((my - ROW_CY_0) / ROW_STEP);

    let best = null, bestD2 = Infinity;

    for (let dr = -1; dr <= 1; dr++) {
      const r = rEst + dr;
      if (r < 0 || r >= numRows) continue;
      const isOdd = r % 2 === 1;

      // Estimate col from X
      const cEst = Math.round(isOdd
        ? (mx + 3.2) / COL_STEP
        : (mx - 22.8) / COL_STEP);

      const cy = ROW_CY_0 + r * ROW_STEP;

      for (let dc = -1; dc <= 1; dc++) {
        const c = cEst + dc;
        if (c < 0 || c >= numCols) continue;
        const cx = colCX(isOdd, c);
        const d2 = (mx - cx) ** 2 + (my - cy) ** 2;
        if (d2 < bestD2) { bestD2 = d2; best = hexGrid[r][c]; }
      }
    }

    // Only light the hex if cursor is roughly within the hex bounds
    const threshold = (HW / 2) ** 2 + (HH / 2) ** 2;
    return bestD2 < threshold ? best : null;
  }

  buildGrid();
  window.addEventListener("resize", () => { activeEl = null; buildGrid(); });

  window.addEventListener("mousemove", function (e) {
    const hex = hexAt(e.clientX, e.clientY);
    if (hex === activeEl) return;
    if (activeEl) activeEl.classList.remove("hex-lit");
    activeEl = hex;
    if (activeEl) activeEl.classList.add("hex-lit");
  }, { passive: true });

  window.addEventListener("mouseleave", function () {
    if (activeEl) { activeEl.classList.remove("hex-lit"); activeEl = null; }
  });
})();

// Navbar scroll-hide / scroll-show
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  let lastY = 0;

  function applyNavState() {
    const y = window.scrollY;
    const goingDown = y > lastY && y > 80;
    navbar.style.transition = "transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease";
    navbar.style.transform = goingDown ? "translateY(-120%)" : "translateY(0)";
    navbar.style.opacity   = goingDown ? "0" : "1";
    navbar.style.pointerEvents = goingDown ? "none" : "";
    lastY = y;
  }

  window.addEventListener("scroll", applyNavState, { passive: true });
});


// Cursor orb --------------------------------------------------------------
const orb = document.querySelector('.cursor-orb');

if (orb) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  const easing = 0.12; // 0.05–0.2 is a good range

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateOrb() {
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;

    orb.style.transform =
      `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateOrb);
  }

  animateOrb();
}
