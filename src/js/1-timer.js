import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btnStart = document.querySelector('[data-start]');
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
           iziToast.error({
             message: 'Please choose a date in the future to enable the Start button!',
             position: 'topRight',
             icon: false,
             progressBar: false,
             close: false,
           });
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};
flatpickr('#datetime-picker', options);

let timerId = null;
btnStart.addEventListener('click', () => {
  if (!userSelectedDate) return;
  btnStart.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelectedDate - now;
    if (timeLeft < 0) {
      clearInterval(timerId);
      iziToast.info({
        title: 'Timer finished',
        message: 'Time is up! The countdown has ended.',
      });
      updateTimerDisplay(0, 0, 0, 0);
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
});


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
     return String(value).padStart(2, '0');
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = addLeadingZero(days); 
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours); 
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes); 
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds); 
}