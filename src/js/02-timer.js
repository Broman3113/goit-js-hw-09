import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

const INTERVAL = 1000;
let timerId = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onOpen: function (selectedDates, dateStr, instance) {
    console.log('onOpen', selectedDates, dateStr, instance);
  },
  onClose: onDateClose,
};

flatpickr('#datetime-picker', options);
let calcTime = {};

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  clearInterval(timerId);
  refs.startBtn.disabled = true;
  updateTimer(convertMs(calcTime));
  timerId = setInterval(() => {
    calcTime -= INTERVAL;
    if (calcTime <= 0) {
      clearInterval(timerId);
      updateTimer(convertMs(0));
      calcTime = {};
      return;
    }
    updateTimer(convertMs(calcTime));
  }, INTERVAL);
}

function onDateClose(selectedDates) {
  const diff = checkDate(selectedDates[0]);
  if (!diff) {
    Notify.failure('Please choose a date in the future');
    pickedDate = {};
    refs.startBtn.disabled = true;
    return;
  }
  refs.startBtn.disabled = false;
  calcTime = diff;
}

function checkDate(date) {
  const now = new Date();
  const diff = date - now;
  if (diff < 0) {
    return false
  }
  return diff;
}

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

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
