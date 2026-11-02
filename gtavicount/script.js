const preloadDate = new Date(2026, 10, 12);
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
    countdownDate.dateTime = isPreload ? "2026-11-12" : "2026-11-19";
    countdownDate.textContent = isPreload ? "November 12, 2026" : "November 19, 2026";
    countdownTimer.setAttribute(
      "aria-label",
      `Time remaining until ${isPreload ? "preload begins on November 12" : "release on November 19"}, 2026`
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
