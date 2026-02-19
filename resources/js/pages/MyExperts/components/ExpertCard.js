import React from 'react';
import { FaUser, FaStar, FaBriefcase, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';

const ExpertCard = ({ expert, t }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <FaUser className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
              {expert.verified && (
                <FaCheckCircle className="w-5 h-5 text-green-500" title={t('searchExperts.verified')} />
              )}
            </div>
            <p className="text-sm text-gray-600">{expert.profession || t('searchExperts.expert')}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <FaStar className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-semibold text-gray-900">{expert.rating || 0}</span>
        <span className="text-sm text-gray-600">({expert.reviews || 0} {t('searchExperts.reviews')})</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaBriefcase className="w-4 h-4 mr-2" />
          <span>{expert.experienceYears} {t('searchExperts.experience')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaBriefcase className="w-4 h-4 mr-2" />
          <span>{t('myExperts.missionsTogether')}: {expert.missionsCount}</span>
        </div>
        {expert.lastMissionDate && (
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendar className="w-4 h-4 mr-2" />
            <span>{t('myExperts.lastMission')}: {expert.lastMissionDate}</span>
          </div>
        )}
        {expert.rate > 0 && (
          <div className="text-sm font-semibold" style={{ color: colors.linkHover }}>
            {expert.rate}€/{t('searchExperts.perDay')}
          </div>
        )}
      </div>

      {expert.specialties && expert.specialties.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">{t('searchExperts.specialties')}:</p>
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full"
                style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
              >
                {t(`searchExperts.specialtyList.${specialty}`) || specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {expert.lastMission && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.buttonBackground}10` }}>
          <p className="text-xs text-gray-600 mb-1">{t('myExperts.lastMissionTitle')}:</p>
          <p className="text-sm font-medium text-gray-900">{expert.lastMission.title}</p>
        </div>
      )}

      <Button className="w-full">
        {t('myExperts.viewProfile')}
      </Button>
    </div>
  );
};

export default ExpertCard;

