export const calculateWorkingDays = (startDate, durationDays) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(start);
  let workingDaysCount = 0;
  const workingDaysList = [];
  
  while (workingDaysCount < durationDays) {
    const dayOfWeek = currentDate.getDay();
    
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysList.push(new Date(currentDate));
      workingDaysCount++;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() - 1);
  
  return {
    totalWorkingDays: workingDaysCount,
    endDate: endDate,
    workingDaysList: workingDaysList,
  };
};

export const getCalendarDays = (startDate, endDate, workingDaysList) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const calendarStart = new Date(start);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
  
  const calendarEnd = new Date(end);
  const daysToAdd = 6 - calendarEnd.getDay();
  calendarEnd.setDate(calendarEnd.getDate() + daysToAdd);
  
  const days = [];
  const current = new Date(calendarStart);
  
  while (current <= calendarEnd) {
    const date = new Date(current);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const isWorkingDay = workingDaysList.some(
      (wd) => wd.toDateString() === date.toDateString()
    );
    
    const isInRange = date >= start && date <= end;
    
    days.push({
      date: isInRange ? date : null,
      isWorkingDay: isWorkingDay && !isWeekend,
      isWeekend: isWeekend,
      isInRange: isInRange,
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

