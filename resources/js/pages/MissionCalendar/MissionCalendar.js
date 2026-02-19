import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import { useMissionCalendar } from './hooks/useMissionCalendar';
import MissionCalendarView from './components/MissionCalendarView';
import MissionList from './components/MissionList';

const MissionCalendar = () => {
  const { t, i18n } = useTranslation();
  const { userRole } = useAuth();
  const { missions, loading, selectedMission, setSelectedMission } = useMissionCalendar();

  if (userRole !== 'expert') {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600">{t('missionCalendar.accessDenied') || 'This page is only available for experts.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('missionCalendar.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaCalendarAlt className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('missionCalendar.subtitle')}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
          </div>
        ) : missions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">{t('missionCalendar.noMissions')}</p>
            <p className="text-sm text-gray-500">{t('missionCalendar.noMissionsDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MissionList
                missions={missions}
                selectedMission={selectedMission}
                onSelectMission={setSelectedMission}
                t={t}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedMission ? (
                <MissionCalendarView
                  mission={selectedMission}
                  t={t}
                  i18n={i18n}
                />
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
                  <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('missionCalendar.selectMission')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCalendar;

