import React from 'react';
import { FaEuroSign, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import { formatMissionDate, getSectorOptions } from '../utils';

const MissionCard = ({ mission, onEdit, onDelete, t, locale }) => {
  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {t('postMission.posted')}: {mission.postedDate}
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{mission.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaEuroSign className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>
                {mission.minBudget !== undefined && mission.maxBudget !== undefined
                  ? `${mission.minBudget.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')} - ${mission.maxBudget.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')}`
                  : mission.budget
                    ? `${mission.budget.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')}`
                    : '0'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaClock className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>{mission.durationDays} {t('postMission.days')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>{t(`postMission.locations.${mission.location}`)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>
                {mission.startDate ? formatMissionDate(mission.startDate, locale) : '-'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">{t('postMission.requirementsTitle')}:</p>
            <div className="flex flex-wrap gap-2">
              {mission.section && (
                <span
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                >
                  {getSectorOptions(t).find(opt => opt.value === mission.section)?.label || mission.section}
                </span>
              )}
              {mission.requirements && mission.requirements.length > 0 && mission.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 lg:min-w-[200px]">
          <Button
            onClick={() => onEdit(mission)}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2"
          >
            <FaEdit className="w-4 h-4" />
            <span>{t('postMission.edit')}</span>
          </Button>
          <Button
            onClick={() => onDelete(mission.id)}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
          >
            <FaTrash className="w-4 h-4" />
            <span>{t('postMission.delete')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;

