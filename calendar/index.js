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

  // 1号是星期几
  const weekIndex = new Date(`${currentYear}/${currentMonth + 1}/1`).getDay();
  // 显示当前月末尾的下月天数（空白格）
  const trailDays = calendarGrid - weekIndex - days;
  let trailVal = 0;

  const calenderTable = [];
  for (let i = 0; i < calendarGrid; i++) {
    // 补充上月天数
    if (i < weekIndex) {
      calenderTable[i] = {
        year: lastMonthYear,
        month: lastMonth,
        day: lastMonthDays - weekIndex + i + 1,
        isCurrentMonth: false
      }
    // 补充下月天数
    } else if (i >= days + weekIndex) {
      if (trailVal < trailDays) {
        trailVal += 1;
      }
      calenderTable[i] = {
        year: nextMonthYear,
        month: nextMonth,
        day: trailVal,
        isCurrentMonth: false,
      }
    } else {
      // 当月日期
      calenderTable[i] = {
        year: currentYear,
        month: currentMonth,
        day: i,
        isCurrentMonth: true
      }
    }
  }

  return calenderTable;
};

function addClassNames(docNode, classNames) {
  classNames.split(" ").forEach(c => {
    c && docNode.classList.add(c);
  })
}

function removeClassNames(docNode, classNames) {
  classNames.split(" ").forEach(c => {
    c && docNode.classList.remove(c);
  })
}

// 渲染日历
function renderCalendar(date = new Date(), create = false) {
  const calendarData = generateCalendar(date);
  const today = new Date();

  const contentElement = document.getElementById("content");
  // 动态创建标签，初始化时需要
  if (create) {
    const fragment = document.createDocumentFragment();
    calendarData.forEach(item => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      const isActive = [
        item.day === today.getDate(),
        item.month === today.getMonth(),
        item.year === today.getFullYear(),
        item.isCurrentMonth
      ].every(Boolean);
      const liClass = `date flex-center ${isActive ? "active" : ""} ${item.isCurrentMonth ? "" : "light"}`;
      addClassNames(li, liClass);
      div.innerText = item.day;
      li.appendChild(div);
      fragment.appendChild(li);
    });
    content.append(fragment);
  } else {
    // 更新内容
    const children = Array.from(content.children).slice(1);

    calendarData.forEach((item, index) => {
      const isActive = [
        item.day === today.getDate(),
        item.month === today.getMonth(),
        item.year === today.getFullYear(),
        item.isCurrentMonth
      ].every(Boolean);
      children[index].childNodes[0].innerText = item.day;
      isActive ? addClassNames(children[index], 'active') : removeClassNames(children[index], 'active');
      item.isCurrentMonth ? removeClassNames(children[index], 'light') : addClassNames(children[index], 'light');
    })
  }
}


window.onload = function () {
  renderCalendar(date, true);
}