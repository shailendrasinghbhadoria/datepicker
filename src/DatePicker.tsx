import React, { useState } from 'react';

const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const DatePicker: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleMonthChange = (increment: number) => {
    const newMonth = currentMonth + increment;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDate(selectedDate);

    if (!isWeekday(selectedDate)) return;

    if (!startDate || endDate) {
      setStartDate(formattedDate);
      setEndDate(null);
    } else if (new Date(formattedDate) > new Date(startDate)) {
      setEndDate(formattedDate);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysArray = [];

    // Fill in the blank days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(currentYear, currentMonth, day);
      const isInRange = startDate && endDate && new Date(formatDate(currentDay)) >= new Date(startDate) && new Date(formatDate(currentDay)) <= new Date(endDate);
      const isWeekend = !isWeekday(currentDay);
      const isSelected = formatDate(currentDay) === startDate || formatDate(currentDay) === endDate;

      daysArray.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isWeekend}
          className={`day ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''} ${isInRange ? 'in-range' : ''}`}
        >
          {day}
        </button>
      );
    }

    return daysArray;
  };

  return (
    <div className="date-picker">
      <div className="controls">
        <button onClick={() => handleMonthChange(-1)}>Previous Month</button>
        <span>{`${currentMonth + 1}/${currentYear}`}</span>
        <button onClick={() => handleMonthChange(1)}>Next Month</button>
      </div>
      <div className="calendar">
        <div className="weekdays">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="days">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default DatePicker;
