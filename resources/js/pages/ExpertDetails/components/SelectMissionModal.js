import React, { useState } from 'react';
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaEuroSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';

const SelectMissionModal = ({ isOpen, onClose, missions, onSelect, missionStatuses = {}, t }) => {
  const [selectedMissionId, setSelectedMissionId] = useState('');

  const getStatusBadge = (missionId) => {
    const status = missionStatuses[missionId];
    if (!status) return null;

    const statusConfig = {
      pending: {
        text: t('missions.status.pending') || 'Pending',
        bgColor: '#fef3c7',
        textColor: '#92400e',
        icon: FaClock,
      },
      accepted: {
        text: t('missions.status.accepted') || 'Accepted',
        bgColor: '#d1fae5',
        textColor: '#065f46',
        icon: FaCheckCircle,
      },
      rejected: {
        text: t('missions.status.rejected') || 'Rejected',
        bgColor: '#fee2e2',
        textColor: '#991b1b',
        icon: FaTimes,
      },
    };

    const config = statusConfig[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: config.bgColor, color: config.textColor }}
      >
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMissionId) {
      onSelect(selectedMissionId);
      setSelectedMissionId('');
    }
  };

  const handleCancel = () => {
    setSelectedMissionId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
              <FaBriefcase className="w-5 h-5" style={{ color: colors.linkHover }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('expertDetails.selectMission') || 'Select Mission'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {t('expertDetails.selectMissionDescription') || 'Please select a mission for which you want to hire this expert.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium mb-2">{t('expertDetails.noMissions') || 'No active missions found'}</p>
              <p className="text-sm text-gray-500">{t('expertDetails.createMissionFirst') || 'Please create a mission first before hiring an expert.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <label
                    key={mission.id}
                    className={`block p-4 rounded-xl border-2 transition-all ${
                      missionStatuses[mission.id] === 'accepted' || missionStatuses[mission.id] === 'pending' || missionStatuses[mission.id] === 'rejected'
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${
                      selectedMissionId === mission.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : missionStatuses[mission.id] === 'accepted'
                        ? 'border-green-200 bg-green-50'
                        : missionStatuses[mission.id] === 'rejected'
                        ? 'border-red-200 bg-red-50'
                        : missionStatuses[mission.id] === 'pending'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="mission"
                        value={mission.id}
                        checked={selectedMissionId === mission.id}
                        onChange={(e) => {
                          const status = missionStatuses[mission.id];
                          if (!status || (status !== 'accepted' && status !== 'pending' && status !== 'rejected')) {
                            setSelectedMissionId(e.target.value);
                          }
                        }}
                        disabled={missionStatuses[mission.id] === 'accepted' || missionStatuses[mission.id] === 'pending' || missionStatuses[mission.id] === 'rejected'}
                        className="mt-1 mr-4 w-5 h-5"
                        style={{ accentColor: colors.linkHover }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                          {getStatusBadge(mission.id)}
                        </div>
                        {mission.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mission.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {mission.location && (
                            <div className="flex items-center space-x-1">
                              <FaMapMarkerAlt className="w-3 h-3" style={{ color: colors.linkHover }} />
                              <span>{mission.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <FaEuroSign className="w-3 h-3" style={{ color: colors.linkHover }} />
                            <span>{mission.minBudget}€ - {mission.maxBudget}€</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaClock className="w-3 h-3" style={{ color: colors.linkHover }} />
                            <span>{mission.durationDays} {t('missions.days')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </form>
          )}
        </div>

        {missions.length > 0 && (
          <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="px-6"
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedMissionId}
              style={{
                backgroundColor: selectedMissionId ? colors.linkHover : '#9ca3af',
                color: '#fff',
                cursor: selectedMissionId ? 'pointer' : 'not-allowed',
                opacity: selectedMissionId ? 1 : 0.6
              }}
              className="px-6"
            >
              {t('expertDetails.sendRequest') || 'Send Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectMissionModal;

