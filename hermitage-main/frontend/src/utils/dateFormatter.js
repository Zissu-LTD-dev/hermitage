// src/utils/dateFormatter.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/he';

// הגדרת הפלאגינים
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('he');

export const dateFormatter = {
  // תאריך ושעה מלאים
  getFullDateTime: (timestamp) => {
    return dayjs(timestamp)
      .tz('Asia/Jerusalem')
      .format('DD/MM/YYYY HH:mm:ss');
  },

  // רק שעה
  getTimeOnly: (timestamp) => {
    return dayjs(timestamp)
      .tz('Asia/Jerusalem')
      .format('HH:mm');
  },

  // רק תאריך
  getDateOnly: (timestamp) => {
    return dayjs(timestamp)
      .tz('Asia/Jerusalem')
      .format('DD/MM/YYYY');
  },

  // תאריך בפורמט ידידותי
  getFriendlyDate: (timestamp) => {
    return dayjs(timestamp)
      .tz('Asia/Jerusalem')
      .format('dddd, D בMMMM YYYY');
  },

  // זמן יחסי (לפני כמה זמן)
  getRelativeTime: (timestamp) => {
    return dayjs(timestamp).fromNow();
  }
};