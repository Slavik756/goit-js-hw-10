import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btnStart = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let timerId = null;

// При завантаженні сторінки кнопка повинна бути неактивною
btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    if (selectedDate < new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future!',
        position: 'topRight',
        icon: false,
        progressBar: false,
        close: false,
      });
      btnStart.disabled = true; // Деактивувати кнопку при виборі дати в минулому
    } else {
      btnStart.disabled = false; // Активувати кнопку при виборі валідної дати
      userSelectedDate = selectedDate;
    }
  },
};
flatpickr(datetimePicker, options);

// Обробник події для кнопки Старт
btnStart.addEventListener('click', () => {
  if (!userSelectedDate) return;

  // Деактивуємо кнопку і інпут під час відліку
  btnStart.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelectedDate - now;

    if (timeLeft < 0) {
      clearInterval(timerId);
      iziToast.info({
        title: 'Timer finished',
        message: 'Time is up!',
      });
      updateTimerDisplay(0, 0, 0, 0);

      // Після завершення таймера активуємо тільки інпут
      datetimePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
});

// Перетворення мілісекунд у дні, години, хвилини і секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Оновлення відображення таймера
function updateTimerDisplay(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}
