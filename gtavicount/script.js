const releaseDate = new Date(2026, 10, 19);
const countdownStatus = document.querySelector("#countdown-status");
const timeValues = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = releaseDate.getTime() - Date.now();

  if (remaining <= 0) {
    Object.values(timeValues).forEach((value) => {
      value.textContent = "00";
    });
    countdownStatus.textContent = "The wait is over. Welcome to Vice City.";
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
