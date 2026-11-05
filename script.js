const preloadDate = new Date(2026, 10, 10);
const releaseDate = new Date(2026, 10, 19);
const countdownEvent = document.querySelector("#countdown-event");
const countdownDate = document.querySelector("#countdown-date");
const countdownTimer = document.querySelector("#countdown-timer");
const defaultStatus = document.querySelector("#default-status");
const postPreloadStatus = document.querySelector("#post-preload-status");
const releaseStatus = document.querySelector("#release-status");
const timeValues = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};
let activePhase;

function updateCountdown() {
  const now = Date.now();
  const phase = now < preloadDate.getTime()
    ? "preload"
    : now < releaseDate.getTime()
      ? "release-countdown"
      : "released";
  const targetDate = phase === "preload" ? preloadDate : releaseDate;

  if (phase !== activePhase) {
    activePhase = phase;
    const isPreload = phase === "preload";
    countdownEvent.textContent = isPreload ? "Preload begins" : "Release";
    countdownDate.dateTime = isPreload ? "2026-11-10" : "2026-11-19";
    countdownDate.textContent = isPreload ? "November 10, 2026" : "November 19, 2026";
    countdownTimer.setAttribute(
      "aria-label",
      `Time remaining until ${isPreload ? "preload begins on November 10" : "release on November 19"}, 2026`
    );
    defaultStatus.hidden = phase !== "preload";
    postPreloadStatus.hidden = phase === "preload";

    if (phase === "released") {
      releaseStatus.textContent = "The wait is over. Welcome to Vice City.";
    }
  }

  const remaining = Math.max(0, targetDate.getTime() - now);

  if (remaining === 0) {
    Object.values(timeValues).forEach((value) => {
      value.textContent = "00";
    });
    return;
  }

  const secondsRemaining = Math.floor(remaining / 1000);
  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  timeValues.days.textContent = String(days).padStart(2, "0");
  timeValues.hours.textContent = String(hours).padStart(2, "0");
  timeValues.minutes.textContent = String(minutes).padStart(2, "0");
  timeValues.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const downloadSpeed = document.querySelector("#download-speed");
const downloadTime = document.querySelector("#download-time");
const gameSizeGigabytes = 210;

function formatDownloadTime(totalSeconds) {
  const units = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  let remaining = totalSeconds;
  const parts = [];

  units.forEach(([unit, seconds]) => {
    const count = Math.floor(remaining / seconds);

    if (count > 0) {
      parts.push(`${count} ${unit}${count === 1 ? "" : "s"}`);
      remaining %= seconds;
    }
  });

  return parts.slice(0, 2).join(", ");
}

function updateDownloadTime() {
  const speedMbps = downloadSpeed.valueAsNumber;

  if (!Number.isFinite(speedMbps) || speedMbps < 0.1) {
    downloadTime.textContent = "Enter a speed of at least 0.1 Mbps.";
    return;
  }

  const totalSeconds = Math.ceil((gameSizeGigabytes * 8000) / speedMbps);
  downloadTime.textContent = formatDownloadTime(totalSeconds);
}

downloadSpeed.addEventListener("input", updateDownloadTime);
updateDownloadTime();

const trailerSection = document.querySelector(".trailer-section");
const trailerCards = [...trailerSection.querySelectorAll(".trailer-card")];
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroExpandedHeight;
let scrollEffectsFrame;

trailerSection.classList.add("is-stacking");

function easeInOut(progress) {
  return progress * progress * (3 - 2 * progress);
}

function measureHeroHeight() {
  hero.style.removeProperty("height");
  heroExpandedHeight = hero.getBoundingClientRect().height;
}

function updateHeroHeight() {
  const compactHeight = Number.parseFloat(
    window.getComputedStyle(hero).getPropertyValue("--hero-compact-height")
  );
  const scrollRange = Math.max(window.innerHeight * 0.35, 300);
  const progress = reducedMotion.matches
    ? 0
    : easeInOut(Math.min(1, Math.max(0, window.scrollY / scrollRange)));
  const height = heroExpandedHeight - (heroExpandedHeight - compactHeight) * progress;

  hero.style.height = `${height}px`;
}

function updateTrailerStack() {
  const sectionTop = trailerSection.getBoundingClientRect().top;
  const scrollRange = Math.max(window.innerHeight * 0.9, 600);
  const scrollProgress = easeInOut(Math.min(
    1,
    Math.max(0, (window.innerHeight - sectionTop) / scrollRange)
  ));
  const progress = reducedMotion.matches || trailerSection.contains(document.activeElement)
    ? 1
    : scrollProgress;
  const cardWidth = trailerCards[0].getBoundingClientRect().width;
  const cardHeight = cardWidth * 9 / 16 + 40;
  const spreadStep = cardHeight + 20;

  trailerSection.style.minHeight = `${spreadStep * (trailerCards.length - 1) + cardHeight}px`;

  trailerCards.forEach((card, index) => {
    const collapsedOffset = index * 8;
    const expandedOffset = index * spreadStep;
    card.style.setProperty(
      "--stack-y",
      `${collapsedOffset + (expandedOffset - collapsedOffset) * progress}px`
    );
    card.style.zIndex = String(trailerCards.length - index);
  });
}

function scheduleScrollEffects() {
  if (scrollEffectsFrame !== undefined) {
    return;
  }

  scrollEffectsFrame = window.requestAnimationFrame(() => {
    scrollEffectsFrame = undefined;
    updateHeroHeight();
    updateTrailerStack();
  });
}

window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
window.addEventListener("resize", () => {
  measureHeroHeight();
  scheduleScrollEffects();
});
trailerSection.addEventListener("focusin", scheduleScrollEffects);
trailerSection.addEventListener("focusout", scheduleScrollEffects);
reducedMotion.addEventListener("change", scheduleScrollEffects);
measureHeroHeight();
scheduleScrollEffects();
