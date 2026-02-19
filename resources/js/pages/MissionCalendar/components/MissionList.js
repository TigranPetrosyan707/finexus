import React from 'react';
import { FaBriefcase, FaClock, FaCheckCircle } from 'react-icons/fa';

const MissionList = ({ missions, selectedMission, onSelectMission, t }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          {t('missionCalendar.myMissions')}
        </h2>
      </div>
      <div className="p-2">
        {missions.length === 0 ? (
          <div className="text-center py-8">
            <FaBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{t('missionCalendar.noMissions')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {missions.map((mission) => (
              <button
                key={mission.id}
                onClick={() => onSelectMission(mission)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedMission?.id === mission.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    {getStatusIcon(mission.status)}
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {mission.mission?.title || t('missionCalendar.unknownMission')}
                    </h3>
                  </div>
                </div>
                {mission.mission && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{mission.mission.location}</span>
                    <span>•</span>
                    <span>{mission.mission.durationDays} {t('missions.days')}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionList;

