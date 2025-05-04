import moment from "moment-timezone";

const NPT_TIMEZONE = moment.tz.guess();

export const DateHelper = {
  toUTC: (nptDateTimeStr) => {
    return moment.tz(nptDateTimeStr, NPT_TIMEZONE).utc().toDate();
  },

  toNPT: (utcDate) => {
    return moment.utc(utcDate).tz(NPT_TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
  },

  toNPTDate: (utcDate) => {
    return moment.utc(utcDate).tz(NPT_TIMEZONE).toDate();
  },
};
