import moment from 'moment';
import 'moment/locale/id.js';

export const genDates = (startDate, endDate) => {
  const start = moment.utc(startDate).startOf('day');
  const end = moment.utc(endDate).startOf('day');

  /**
   * @type {moment.Moment[]}
   */
  const dates = [];

  while (start.isSameOrBefore(end)) {
    dates.push(start.clone());
    start.add(1, 'day');
  }

  return dates;
};

export const formatTime = (time, format, opts = { fb: '', locale: 'id' }) => {
  if (!time) return opts.fb;
  return moment(time).locale(opts.locale).format(format);
};
