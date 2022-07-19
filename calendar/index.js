const calendarGrid = 42; // 7 * 6 宫格
const date = new Date();

// 是否是闰年，用来获取 2月 天数
const isLeap = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// 获取每月的天数
const getDays = (year, month) => {
  // 闰年2月天数
  const feb = isLeap(year) ? 29 : 28;
  const daysPerMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[month];
}

// 获取上个月/下个月有多少天
const getNextOrLastMonthDays = (date, type) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (type === 'last') {
    // 如果当前月份为一月（month=0），则上个月为前一年的12月（month=11）
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastYear = lastMonth === 11 ? year - 1 : year;

    return {
      year: lastYear,
      month: lastMonth,
      days: getDays(lastYear, lastMonth)
    }
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = nextMonth === 0 ? year + 1 : year;
  return {
    year: nextYear,
    month: nextMonth,
    days: getDays(nextYear, nextMonth)
  }
}

const generateCalendar = (date) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const days = getDays(currentYear, currentMonth);
  // 获取上个月末尾天数和下个月开头天数，用来弥补当前月日历空白处
  const { year: lastMonthYear, month: lastMonth, days: lastMonthDays } = getNextOrLastMonthDays(date, 'last');
  const { year: nextMonthYear, month: nextMonth, days: nextMonthDays } = getNextOrLastMonthDays(date, 'next');
}