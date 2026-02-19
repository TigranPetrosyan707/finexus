import React, { useMemo } from 'react';
import { FaClock, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import { calculateWorkingDays, getCalendarDays } from '../utils/calendarUtils';

const MissionCalendarView = ({ mission, t, i18n }) => {
  const calendarData = useMemo(() => {
    if (!mission.mission || !mission.startDate) {
      return null;
    }

    const startDate = new Date(mission.startDate);
    const durationDays = mission.mission.durationDays || 0;
    const workingDays = calculateWorkingDays(startDate, durationDays);
    const endDate = workingDays.endDate;
    const calendarDays = getCalendarDays(startDate, endDate, workingDays.workingDaysList);

    return {
      startDate,
      endDate,
      durationDays,
      workingDays: workingDays.totalWorkingDays,
      calendarDays,
    };
  }, [mission]);

  if (!calendarData) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600">{t('missionCalendar.noStartDate')}</p>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = calendarData.startDate.getMonth();
  const currentYear = calendarData.startDate.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mission.mission.title}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt className="w-4 h-4" style={{ color: colors.linkHover }} />
            <span>{mission.mission.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaEuroSign className="w-4 h-4" style={{ color: colors.linkHover }} />
            <span>{mission.mission.minBudget}€ - {mission.mission.maxBudget}€</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="w-4 h-4" style={{ color: colors.linkHover }} />
            <span>{mission.mission.durationDays} {t('missions.days')}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">{t('missionCalendar.startDate')}</p>
            <p className="font-semibold text-gray-900">
              {calendarData.startDate.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">{t('missionCalendar.endDate')}</p>
            <p className="font-semibold text-gray-900">
              {calendarData.endDate.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">{t('missionCalendar.workingDays')}</p>
            <p className="font-semibold text-gray-900">{calendarData.workingDays}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">{t('missionCalendar.totalDays')}</p>
            <p className="font-semibold text-gray-900">{calendarData.durationDays}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarData.calendarDays.map((day, index) => {
            const isStartDate = day.date && day.date.toDateString() === calendarData.startDate.toDateString();
            const isEndDate = day.date && day.date.toDateString() === calendarData.endDate.toDateString();
            const isWorkingDay = day.isWorkingDay;
            const isPast = day.date && day.date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg border-2 transition-all ${
                  !day.date
                    ? 'border-transparent'
                    : isStartDate
                    ? 'bg-green-500 text-white border-green-600 font-bold shadow-lg'
                    : isEndDate
                    ? 'bg-red-500 text-white border-red-600 font-bold shadow-lg'
                    : isWorkingDay
                    ? isPast
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
                title={day.date ? day.date.toLocaleDateString() : ''}
              >
                {day.date ? day.date.getDate() : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-600"></div>
          <span>{t('missionCalendar.legend.startDate')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-500 border-2 border-red-600"></div>
          <span>{t('missionCalendar.legend.endDate')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-200"></div>
          <span>{t('missionCalendar.legend.workingDay')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200"></div>
          <span>{t('missionCalendar.legend.weekend')}</span>
        </div>
      </div>
    </div>
  );
};

export default MissionCalendarView;

