const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  if (prefersReducedMotion) {
    polygon.setAttribute("d", buildPolygonPath(1));
    outline.setAttribute("d", buildPolygonPath(1));
    return;
  }

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

  window.addEventListener("scroll", function () {
    document.querySelector(".scroll-arrow").style.display =
      window.scrollY > 50 ? "none" : "block";
  });

  // toggle menu/navbar script
  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  emailjs.init({ publicKey: "9ikn3t9V_OwCkCodC" });

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
  $(".view-more-toggle").attr("aria-expanded", "false");
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
    // The grid drifts with the parallax, so measure from its current position
    const hex = hexAt(e.clientX, e.clientY - gridEl.getBoundingClientRect().top);
    if (hex === activeEl) return;
    if (activeEl) activeEl.classList.remove("hex-lit");
    activeEl = hex;
    if (activeEl) activeEl.classList.add("hex-lit");
  }, { passive: true });

  window.addEventListener("mouseleave", function () {
    if (activeEl) { activeEl.classList.remove("hex-lit"); activeEl = null; }
  });
})();

// Navbar scroll-hide / scroll-show — inline styles so nothing can override
(function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  navbar.style.transition = "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease";
  navbar.style.willChange = "transform";

  let lastY = window.scrollY;
  let hidden = false;
  let ticking = false;
  const HIDE_AFTER = 120;
  const DELTA = 6;

  function setHidden(h) {
    if (h === hidden) return;
    hidden = h;
    if (h) {
      navbar.style.setProperty("transform", "translateY(-110%)", "important");
      navbar.style.setProperty("opacity", "0", "important");
      navbar.style.setProperty("pointer-events", "none", "important");
    } else {
      navbar.style.setProperty("transform", "translateY(0)", "important");
      navbar.style.setProperty("opacity", "1", "important");
      navbar.style.setProperty("pointer-events", "auto", "important");
    }
  }

  function update() {
    const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    if (Math.abs(y - lastY) >= DELTA) {
      setHidden(y > lastY && y > HIDE_AFTER);
      lastY = y;
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  // Capture mode so we catch scroll on whichever element is actually scrolling
  window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  document.addEventListener("wheel", onScroll, { passive: true });
  document.addEventListener("touchmove", onScroll, { passive: true });
})();


// Cursor orb --------------------------------------------------------------
const orb = document.querySelector('.cursor-orb');

if (orb && !prefersReducedMotion) {
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

// Robot mascot ----------------------------------------------------------------
(function initRobot() {
  const robot = document.querySelector(".robot");
  if (!robot) return;

  const pupils = robot.querySelector(".robot-pupils");
  const bubble = robot.querySelector(".robot-bubble");
  const MAX_LOOK = 3.5; // how far the pupils move, in SVG units
  const IDLE_MS = 30000;
  const DIZZY_MS = 3500;
  const DIZZY_COOLDOWN_MS = 8000;
  const DIZZY_FLIPS = 4; // direction changes needed...
  const DIZZY_WINDOW_MS = 1500; // ...within this time
  const MIN_TRAVEL = 40; // px scrolled before a direction change counts

  function look(x, y) {
    if (robot.classList.contains("is-dizzy")) return;
    const box = robot.getBoundingClientRect();
    const dx = x - (box.left + box.width / 2);
    const dy = y - (box.top + box.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    const reach = Math.min(dist / 40, 1) * MAX_LOOK;
    pupils.style.transform = `translate(${(dx / dist) * reach}px, ${(dy / dist) * reach}px)`;
  }

  // Blink at random intervals
  function scheduleBlink() {
    setTimeout(() => {
      robot.classList.add("is-blinking");
      setTimeout(() => {
        robot.classList.remove("is-blinking");
        scheduleBlink();
      }, 140);
    }, 2500 + Math.random() * 4000);
  }
  if (!prefersReducedMotion) scheduleBlink();

  // Falls asleep after a minute without activity
  let idleTimer;
  function wake() {
    robot.classList.remove("is-asleep");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (robot.classList.contains("is-dizzy")) return;
      bubble.textContent = "training... epoch 3 of 10,000. Wake me when it converges.";
      pupils.style.transform = "";
      robot.classList.add("is-asleep");
    }, IDLE_MS);
  }

  // Gets dizzy when the page is scrolled up and down quickly
  let lastY = window.scrollY;
  let direction = 0;
  let travel = 0;
  let flips = [];
  let dizzyUntil = 0;

  function getDizzy(now) {
    dizzyUntil = now + DIZZY_MS + DIZZY_COOLDOWN_MS;
    flips = [];
    bubble.textContent = "please, I have a small learning rate";
    pupils.style.transform = "";
    robot.classList.add("is-dizzy");
    setTimeout(() => robot.classList.remove("is-dizzy"), DIZZY_MS);
  }

  window.addEventListener("scroll", () => {
    wake();
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (!delta) return;

    const now = performance.now();
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) {
      if (direction && travel >= MIN_TRAVEL) flips.push(now);
      direction = nextDirection;
      travel = 0;
    }
    travel += Math.abs(delta);

    flips = flips.filter((t) => now - t < DIZZY_WINDOW_MS);
    if (flips.length >= DIZZY_FLIPS && now > dizzyUntil) getDizzy(now);
  }, { passive: true });

  window.addEventListener("pointermove", (e) => {
    wake();
    look(e.clientX, e.clientY);
  }, { passive: true });
  window.addEventListener("pointerdown", (e) => {
    wake();
    look(e.clientX, e.clientY);
  }, { passive: true });
  window.addEventListener("keydown", wake);

  wake();
})();

// Command palette (Ctrl+K / Cmd+K) --------------------------------------------
(function initCommandPalette() {
  const root = document.querySelector(".cmdk");
  const openBtn = document.querySelector(".cmdk-open");
  if (!root || !openBtn) return;

  const input = root.querySelector(".cmdk-input");
  const list = root.querySelector(".cmdk-list");
  const empty = root.querySelector(".cmdk-empty");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  openBtn.querySelector("kbd").textContent = isMac ? "⌘K" : "Ctrl K";

  const text = (parent, selector) => {
    const el = parent.querySelector(selector);
    return el ? el.textContent.trim() : "";
  };

  function goTo(el) {
    close();
    if (window.siteScrollTo) window.siteScrollTo(el);
    else el.scrollIntoView();
    if (el.tagName === "SECTION") return;
    setTimeout(() => {
      el.classList.add("cmdk-flash");
      setTimeout(() => el.classList.remove("cmdk-flash"), 1800);
    }, 900);
  }
  const openLink = (url) => () => {
    close();
    window.open(url, "_blank", "noopener");
  };

  // Everything searchable is read from the page, so new content appears automatically
  const items = [];
  function add(group, label, hint, keywords, run) {
    items.push({ group, label, hint, run, search: `${group} ${label} ${hint} ${keywords}`.toLowerCase() });
  }
  document.querySelectorAll('.navbar .menu a[href^="#"]').forEach((a) => {
    add("Sections", a.textContent.trim(), "", "", () => goTo(document.querySelector(a.getAttribute("href"))));
  });
  document.querySelectorAll(".publication").forEach((el) => {
    add("Publications", text(el, "h3"), text(el, ".pub-venue"), text(el, ".publication-abstract"), () => goTo(el));
  });
  document.querySelectorAll(".project").forEach((el) => {
    add("Projects", text(el, "h3"), text(el, ".tech-stack").replace(/\s+/g, " "), text(el, ".project-summary"), () => goTo(el));
  });
  document.querySelectorAll(".timeline-wavy-item").forEach((el) => {
    add(el.classList.contains("edu-right") ? "Education" : "Experience", text(el, "h3"), text(el, "p"), text(el, ".timeline-bullets"), () => goTo(el));
  });
  document.querySelectorAll(".skill").forEach((el) => {
    add("Skills", text(el, ".skill-label"), "", "", () => goTo(el));
  });
  add("Links", "GitHub", "github.com/mahmoudmayaleh", "code repositories", openLink("https://github.com/mahmoudmayaleh"));
  add("Links", "LinkedIn", "linkedin.com/in/mahmoud-mayaleh", "profile", openLink("https://www.linkedin.com/in/mahmoud-mayaleh/"));
  add("Links", "Email", "mahmoud@mayaleh.com", "contact mail", () => {
    close();
    window.location.href = "mailto:mahmoud@mayaleh.com";
  });

  let visible = [];
  let active = 0;

  function setActive(i) {
    if (!visible.length) return;
    active = (i + visible.length) % visible.length;
    list.querySelectorAll(".cmdk-item").forEach((el, n) => {
      el.classList.toggle("is-active", n === active);
      el.setAttribute("aria-selected", n === active ? "true" : "false");
      if (n === active) {
        el.scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", el.id);
      }
    });
  }

  function render() {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    visible = items.filter((item) => terms.every((t) => item.search.includes(t)));
    list.innerHTML = "";
    let group = null;
    visible.forEach((item, i) => {
      if (item.group !== group) {
        group = item.group;
        const head = document.createElement("li");
        head.className = "cmdk-group";
        head.setAttribute("role", "presentation");
        head.textContent = group;
        list.appendChild(head);
      }
      const li = document.createElement("li");
      li.className = "cmdk-item";
      li.id = `cmdk-item-${i}`;
      li.setAttribute("role", "option");
      const label = document.createElement("span");
      label.className = "cmdk-label";
      label.textContent = item.label;
      li.appendChild(label);
      if (item.hint) {
        const hint = document.createElement("span");
        hint.className = "cmdk-hint";
        hint.textContent = item.hint;
        li.appendChild(hint);
      }
      li.addEventListener("mousemove", () => { if (active !== i) setActive(i); });
      li.addEventListener("click", () => item.run());
      list.appendChild(li);
    });
    empty.hidden = visible.length > 0;
    setActive(0);
  }

  function open() {
    if (!root.hidden) return;
    root.hidden = false;
    input.value = "";
    render();
    input.focus();
    if (window.siteLenis) window.siteLenis.stop();
  }
  function close() {
    if (root.hidden) return;
    root.hidden = true;
    if (window.siteLenis) window.siteLenis.start();
  }

  openBtn.addEventListener("click", () => {
    document.querySelector(".navbar .menu").classList.remove("active");
    document.querySelectorAll(".menu-btn i").forEach((i) => i.classList.remove("active"));
    open();
  });
  input.addEventListener("input", render);
  root.addEventListener("click", (e) => { if (e.target === root) close(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (visible[active]) visible[active].run(); }
    else if (e.key === "Tab") { e.preventDefault(); }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (root.hidden) open();
      else close();
    } else if (e.key === "Escape") {
      close();
    }
  });
})();

// Live GitHub activity --------------------------------------------------------
(function initGitHubActivity() {
  const panel = document.querySelector(".gh-activity");
  if (!panel) return;

  const USER = "mahmoudmayaleh";
  // GitHub only serves the calendar to signed-in API calls, so this public mirror reads it
  const CALENDAR_API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;
  const PUSH_API = `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=5`;
  const CALENDAR_MS = 5 * 60 * 1000;
  const PUSH_MS = 3 * 60 * 1000; // GitHub allows 60 anonymous requests an hour

  const graph = panel.querySelector(".gh-graph");
  const scroller = panel.querySelector(".gh-scroll");
  const status = panel.querySelector(".gh-status");
  const statusText = panel.querySelector(".gh-status-text");
  const tip = panel.querySelector(".gh-tip");

  let counts = null; // date -> count from the last refresh
  let lastPush = null;
  let calendarAt = 0;
  let pushAt = 0;

  const parseDay = (date) => new Date(`${date}T00:00:00Z`);
  const format = (date, options) =>
    parseDay(date).toLocaleDateString("en", { timeZone: "UTC", ...options });

  function relativeTime(date) {
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    const seconds = (new Date(date) - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    for (const [unit, size] of units) {
      if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
    }
    return "just now";
  }

  function place(tag, className, text, column, row) {
    const el = document.createElement(tag);
    el.className = className;
    if (text) el.textContent = text;
    el.style.gridColumn = column;
    el.style.gridRow = row;
    graph.appendChild(el);
    return el;
  }

  function renderCalendar(data) {
    const days = data.contributions;
    const total = data.total.lastYear;
    const firstWeekday = parseDay(days[0].date).getUTCDay();
    const weeks = Math.ceil((days.length + firstWeekday) / 7);
    const previous = counts;
    const firstRender = !previous;
    const scrolled = scroller.scrollLeft;
    counts = {};

    panel.querySelector(".gh-total").textContent =
      `${total.toLocaleString("en")} contributions in the last year`;
    graph.innerHTML = "";
    graph.style.setProperty("--weeks", weeks);
    graph.setAttribute("aria-label", `GitHub contribution graph: ${total} contributions in the last year`);

    [["Mon", 3], ["Wed", 5], ["Fri", 7]].forEach(([day, row]) => {
      place("span", "gh-day", day, 1, row);
    });

    let lastMonth = null;
    days.forEach((day, i) => {
      const index = i + firstWeekday;
      const column = Math.floor(index / 7) + 2;
      const weekday = index % 7;
      counts[day.date] = day.count;

      const month = day.date.slice(0, 7);
      // Label each month once, skipping a first week too short to fit its label
      if (month !== lastMonth && weekday === 0 && column < weeks) {
        place("span", "gh-month", format(day.date, { month: "short" }), column, 1);
        lastMonth = month;
      }

      // Each day opens GitHub's own view of what happened on that date
      const cell = place("a", `gh-cell gh-level-${day.level}`, "", column, weekday + 2);
      cell.href = `https://github.com/${USER}?tab=overview&from=${day.date}&to=${day.date}`;
      cell.target = "_blank";
      cell.rel = "noopener";
      cell.tabIndex = -1;
      const count = day.count === 1 ? "1 contribution" : `${day.count || "No"} contributions`;
      cell.dataset.tip = `${count} on ${format(day.date, { month: "long", day: "numeric", year: "numeric" })}`;
      if (previous && previous[day.date] !== day.count) cell.classList.add("gh-cell-new");
    });

    panel.hidden = false;
    if (firstRender) {
      scroller.scrollLeft = scroller.scrollWidth; // narrow screens start at the latest weeks
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    } else {
      scroller.scrollLeft = scrolled;
    }
  }

  function renderPush() {
    if (!lastPush) return;
    statusText.textContent = `Last push to ${lastPush.repo}, ${relativeTime(lastPush.at)}`;
    status.href = `https://github.com/${USER}/${lastPush.repo}`;
    status.hidden = false;
  }

  async function refreshCalendar() {
    calendarAt = Date.now();
    try {
      const res = await fetch(CALENDAR_API);
      if (!res.ok) throw new Error(`Contributions API ${res.status}`);
      const data = await res.json();
      if (data.contributions && data.contributions.length) renderCalendar(data);
    } catch (e) {
      // Keep showing the last good data; the panel stays hidden if there is none
    }
  }

  async function refreshPush() {
    pushAt = Date.now();
    try {
      const res = await fetch(PUSH_API);
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const repo = (await res.json()).find((r) => !r.fork);
      if (repo) {
        lastPush = { repo: repo.name, at: repo.pushed_at };
        renderPush();
      }
    } catch (e) {
      // The line simply stays as it was
    }
  }

  function refreshIfStale() {
    if (document.hidden) return;
    if (Date.now() - calendarAt >= CALENDAR_MS) refreshCalendar();
    if (Date.now() - pushAt >= PUSH_MS) refreshPush();
    renderPush();
  }

  // Tooltip: appears instantly and shows the real count for that day
  graph.addEventListener("pointerover", (e) => {
    const cell = e.target.closest(".gh-cell");
    if (!cell) return;
    tip.textContent = cell.dataset.tip;
    tip.hidden = false;
    const box = panel.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const half = tip.offsetWidth / 2;
    const center = rect.left + rect.width / 2 - box.left;
    tip.style.left = `${Math.min(Math.max(center, half + 8), box.width - half - 8)}px`;
    tip.style.top = `${rect.top - box.top - 8}px`;
  });
  graph.addEventListener("pointerleave", () => { tip.hidden = true; });

  // Start when the visitor gets near the panel, then keep it current while they read
  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    refreshCalendar();
    refreshPush();
    setInterval(refreshIfStale, 30000);
    document.addEventListener("visibilitychange", refreshIfStale);
  }, { rootMargin: "800px" }).observe(panel.parentElement);
})();

// Project diagrams come alive -------------------------------------------------
// Coordinates follow the arrows and boxes drawn in each image. Each inner array
// plays together, one after the other. Strings are paths, r is a box, c is a circle.
(function initProjectFlows() {
  if (prefersReducedMotion) return;

  const FLOWS = {
    "git-commit.jpg": { w: 1200, h: 674, dur: 5500, steps: [
      [{ r: [46, 82, 300, 287] }, "M345 112 L430 112"],
      [{ r: [432, 33, 390, 156] }, "M626 190 L626 262"],
      [{ r: [432, 262, 390, 156] }, "M626 420 L626 490", "M192 368 L192 570 L430 570"],
      [{ r: [432, 490, 390, 156] }],
      [{ r: [432, 262, 390, 156] }, "M822 340 L905 340"],
      [{ r: [906, 182, 268, 342] }, { c: [1040, 318, 42] }],
    ] },
    "proj-sentiment.jpg": { w: 1200, h: 674, dur: 5000, steps: [
      ["M234 205 L282 243", "M225 248 L282 243", "M233 287 L282 243", "M958 140 L908 197", "M978 190 L908 197", "M965 243 L908 197",
        "M232 425 L282 468", "M218 468 L282 468", "M232 510 L282 468", "M952 385 L908 455", "M975 430 L908 460", "M985 490 L908 465", "M947 550 L908 470"],
      ["M477 243 L552 296", "M712 197 L632 296", "M477 468 L555 391", "M712 462 L628 391"],
      [{ r: [500, 296, 197, 94] }],
      ["M63 133 L105 85 L127 100 L170 50"],
    ] },
    "proj-liplingo.png": { w: 800, h: 328, dur: 4500, steps: [
      [{ r: [230, 128, 106, 68] }],
      ["M336 160 L345 160", { r: [345, 140, 45, 42] }],
      ["M390 160 L415 160", { r: [415, 140, 45, 42] }],
      ["M472 160 L525 160", { r: [525, 118, 100, 84] }],
      ["M628 160 L665 160", { r: [666, 138, 76, 46] }],
    ] },
    "robot-nav.jpg": { w: 1200, h: 674, dur: 6500, steps: [
      [{ c: [95, 75, 56] }, "M1012 158 Q935 205 935 226 Q935 280 1030 315 Q1075 365 1012 402"],
      ["M1012 402 Q900 410 860 437"],
      ["M745 500 Q690 535 603 573 Q520 585 456 541 Q425 510 423 440"],
    ] },
    "proj-5g.jpg": { w: 1200, h: 674, dur: 5000, steps: [
      [{ c: [600, 322, 76] }],
      ["M600 245 L600 150", "M540 268 L460 222", "M660 268 L735 222", "M528 322 L440 322", "M672 322 L760 322"],
      ["M545 365 L500 385 L240 530", "M600 400 L600 530", "M655 365 L700 385 L1000 560"],
    ] },
  };

  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs, parent) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };

  function buildFlow(img, flow) {
    const wrap = document.createElement("div");
    wrap.className = "project-thumb-wrap";
    img.replaceWith(wrap);
    wrap.appendChild(img);

    const svg = make("svg", { class: "project-flow", viewBox: `0 0 ${flow.w} ${flow.h}`, "aria-hidden": "true" }, wrap);
    const dotR = flow.w / 70;
    const lineW = flow.w / 170;
    const parts = [];
    flow.steps.forEach((group, i) => {
      const at = i / flow.steps.length;
      const len = 1 / flow.steps.length;
      group.forEach((step) => {
        if (typeof step === "string") {
          const path = make("path", { d: step, "stroke-width": lineW }, svg);
          const dot = make("circle", { r: dotR }, svg);
          parts.push({ type: "path", path, dot, length: path.getTotalLength(), at, len });
        } else {
          const el = step.r
            ? make("rect", { x: step.r[0], y: step.r[1], width: step.r[2], height: step.r[3], rx: flow.w / 80, "stroke-width": lineW * 1.4 }, svg)
            : make("circle", { cx: step.c[0], cy: step.c[1], r: step.c[2], "stroke-width": lineW * 1.4 }, svg);
          el.setAttribute("class", "project-flow-box");
          parts.push({ type: "box", el, at, len });
        }
      });
    });
    return { svg, parts, dur: flow.dur, frame: null, start: 0 };
  }

  function draw(state, now) {
    const t = ((now - state.start) % state.dur) / state.dur;
    state.parts.forEach((part) => {
      const p = (t - part.at) / part.len;
      if (part.type === "box") {
        part.el.style.opacity = p >= 0 && p <= 1 ? Math.sin(p * Math.PI) : 0;
        return;
      }
      const on = p >= 0 && p <= 1;
      const fade = p > 1 ? Math.max(0, 2 - p) : 1; // the line lingers, then fades
      part.path.style.opacity = p >= 0 ? fade : 0;
      const drawn = part.length * Math.min(Math.max(p, 0), 1);
      part.path.setAttribute("stroke-dasharray", `${drawn} ${part.length}`);
      part.dot.style.opacity = on ? 1 : 0;
      if (on) {
        const point = part.path.getPointAtLength(drawn);
        part.dot.setAttribute("cx", point.x);
        part.dot.setAttribute("cy", point.y);
      }
    });
    state.frame = requestAnimationFrame((time) => draw(state, time));
  }

  function play(state) {
    if (state.frame) return;
    state.start = performance.now();
    state.svg.classList.add("is-playing");
    state.frame = requestAnimationFrame((time) => draw(state, time));
  }
  function stop(state) {
    cancelAnimationFrame(state.frame);
    state.frame = null;
    state.svg.classList.remove("is-playing");
  }

  const touch = window.matchMedia("(hover: none)").matches;
  const viewObserver = touch && new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) play(entry.target._flow);
      else stop(entry.target._flow);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".project-thumb").forEach((img) => {
    const flow = FLOWS[img.getAttribute("src").split("/").pop()];
    if (!flow) return;
    const state = buildFlow(img, flow);
    if (touch) {
      img.parentElement._flow = state;
      viewObserver.observe(img.parentElement);
    } else {
      const card = img.closest(".project");
      card.addEventListener("pointerenter", () => play(state));
      card.addEventListener("pointerleave", () => stop(state));
    }
  });
})();

// Back-to-top button ----------------------------------------------------------
(function initScrollUpButton() {
  const btn = document.querySelector(".scroll-up-btn");
  if (!btn) return;

  function toggle() {
    btn.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    if (window.siteLenis) window.siteLenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo(0, 0);
  });
})();

// ============================================================================
// Apple-style scroll-driven experience (GSAP + ScrollTrigger + Lenis)
// ============================================================================
(function initScrollExperience() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("[scroll-fx] GSAP not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // --- Lenis smooth scroll, synced to GSAP ticker ---------------------------
  let lenis;
  if (typeof Lenis !== "undefined" && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    window.siteLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Make in-page anchor links scroll smoothly via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            scrollToSection(target);
          }
        }
      });
    });
  }

  // Hero and About share one pinned stage, so About lives partway through the pin
  function scrollToSection(el) {
    const pin = ScrollTrigger.getAll().find((t) => t.pin);
    let y = null;
    if (pin && el.closest(".hero-about-stage")) {
      y = el.id === "about" ? pin.start + (pin.end - pin.start) * 0.65 : pin.start;
    }
    if (lenis) lenis.scrollTo(y === null ? el : y, { offset: y === null ? -60 : 0, duration: 1.4 });
    else if (y !== null) window.scrollTo(0, y);
    else el.scrollIntoView();
  }
  window.siteScrollTo = scrollToSection;

  // Take over from the legacy `.reveal` once-trigger fade — make those
  // sections always visible so GSAP `from()` controls the entry.
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("reveal");
    el.classList.add("active"); // satisfy any leftover CSS targeting .active
  });

  // ---- Mobile/desktop split: pinning only on desktop -----------------------
  const mm = gsap.matchMedia();

  // ===========================================================================
  // DESKTOP — full pinned experience
  // ===========================================================================
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    // -------- Hero + About: one shared pin, cross-fade between them -------
    // Timeline structure (0 -> 1):
    //   0.00 - 0.35  Hero content fades/scales out
    //   0.30 - 0.55  About cross-fades in (container + content cascade)
    //   0.55 - 0.80  About holds at full visibility
    //   0.80 - 1.00  About fades/scales out, ready for Experience
    const stage = document.querySelector(".hero-about-stage");
    if (stage) {
      const heroAboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=180%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      });

      // Phase 1 — Hero exit
      heroAboutTl
        .to(".home .text-1", { y: -40, opacity: 0, ease: "power2.in" }, 0)
        .to(".home .text-2", { y: -50, scale: 0.92, opacity: 0, ease: "power2.in" }, 0.05)
        .to(".home .text-3", { y: -30, opacity: 0, ease: "power2.in" }, 0.1)
        .to('.home a[href="#contact"]', { y: -20, scale: 0.9, opacity: 0, ease: "power2.in" }, 0.1)
        .to(".scroll-arrow", { opacity: 0, ease: "power1.in" }, 0)
        .to("#home", { opacity: 0, ease: "power2.in" }, 0.25);

      // Phase 2 — About entry (cross-fades over hero)
      heroAboutTl
        .to("#about", { opacity: 1, ease: "power2.out" }, 0.3)
        .from("#about .title", { y: 40, opacity: 0, ease: "power2.out" }, 0.32)
        .from("#about .left img", { x: -120, opacity: 0, scale: 0.92, ease: "power2.out" }, 0.36)
        .from("#about .right .text", { y: 40, opacity: 0, ease: "power2.out" }, 0.4)
        .from("#about .right p", { y: 40, opacity: 0, ease: "power2.out" }, 0.44)
        .from("#about .right .linkedin-btn", {
          y: 25,
          opacity: 0,
          stagger: 0.05,
          ease: "power2.out",
        }, 0.48);

      // Phase 3 — About exit (fades away as Experience section enters)
      heroAboutTl
        .to("#about .left img", { x: -60, opacity: 0, scale: 0.94, ease: "power2.in" }, 0.82)
        .to("#about .right", { y: -40, opacity: 0, ease: "power2.in" }, 0.84)
        .to("#about .title", { y: -40, opacity: 0, ease: "power2.in" }, 0.82);
    }

    // -------- Timeline (Experience): smooth, free, no pinning -------------
    gsap.utils.toArray(".timeline-wavy-item").forEach((item) => {
      const isLeft = item.classList.contains("exp-left");
      gsap.from(item, {
        x: isLeft ? -100 : 100,
        opacity: 0,
        scale: 0.96,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          end: "top 45%",
          scrub: 0.9,
        },
      });
    });

    // -------- Skills: free scroll, scrubbed bar fills + radar scale ------
    const radar = document.getElementById("radar-polygon-group");
    if (radar) {
      gsap.from(radar, {
        scale: 0.7,
        opacity: 0.2,
        transformOrigin: "160px 160px",
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 80%",
          end: "top 30%",
          scrub: 0.8,
        },
      });
    }
    gsap.utils.toArray(".skill-bar-fill").forEach((bar) => {
      const target = bar.dataset.skill || 80;
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: target + "%",
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            end: "top 55%",
            scrub: 0.8,
          },
        }
      );
    });

    // -------- Publications: free scroll, card fade-up scrubbed -----------
    gsap.utils.toArray(".publications .publication").forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        rotateX: 6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 60%",
          scrub: 0.7,
        },
      });
    });

    // -------- Projects: free scroll, card fade-up scrubbed ---------------
    gsap.utils.toArray(".projects .project").forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        rotateX: 6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 60%",
          scrub: 0.7,
        },
      });
    });

    // Section titles: fade in early, stay stable through the section,
    // fade out near the end. Driven by the SECTION's scroll progress,
    // not the title's own position — so the title can't trigger late.
    [
      { sectionId: "#timeline" },
      { sectionId: "#skills" },
      { sectionId: "#publications" },
      { sectionId: "#projects" },
    ].forEach(({ sectionId }) => {
      const section = document.querySelector(sectionId);
      const title = section && section.querySelector(".title");
      if (!title) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 0.6,
        },
      });
      // 0.00 - 0.08  fade in
      // 0.08 - 0.90  stable visible
      // 0.90 - 1.00  fade out
      tl.from(title, { y: 30, opacity: 0, duration: 0.08, ease: "power2.out" }, 0)
        .to(title, { y: -30, opacity: 0, duration: 0.10, ease: "power2.in" }, 0.90);
    });

    // -------- Contact: free scroll, fields cascade in --------------------
    gsap.from("#contact .title", {
      y: 30,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#contact .title",
        start: "top 90%",
        end: "top 65%",
        scrub: 0.6,
      },
    });
    gsap.from(
      ".contact .left .row, .contact .right .text, .contact .right .field, .contact .right .button-area",
      {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact",
          start: "top 75%",
          end: "top 35%",
          scrub: 0.6,
        },
      }
    );

    // -------- Background parallax: hex grid drifts at half speed -----------
    gsap.to("#hex-grid", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  // ===========================================================================
  // MOBILE — simpler fades, no pinning
  // ===========================================================================
  mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.utils
      .toArray(
        ".about, .timeline-wavy-item, .skills-content, .project, .publication, .contact"
      )
      .forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

    // Skill bars: trigger once when in view
    gsap.utils.toArray(".skill-bar-fill").forEach((bar) => {
      const target = bar.dataset.skill || 80;
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: target + "%",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 85%" },
        }
      );
    });
  });

  // ===========================================================================
  // REDUCED MOTION — no scroll effects, content shown as-is
  // ===========================================================================
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.utils.toArray(".skill-bar-fill").forEach((bar) => {
      bar.style.width = (bar.dataset.skill || 80) + "%";
    });
  });

  // Refresh once everything has settled (images, fonts)
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
