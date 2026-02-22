import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaEuroSign, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaBriefcase } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import { formatMissionDate, getSectorOptions } from '../../PostMission/utils';
import { availableMissionsDB } from '../../AvailableMissions/db';

const MissionViewFromRequest = ({ id }) => {
  const { t, i18n } = useTranslation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMission = async () => {
      try {
        setLoading(true);
        const allMissions = await availableMissionsDB.getAllAvailableMissions();
        const foundMission = allMissions.find(m => m.id === id);
        setMission(foundMission || null);
      } catch (error) {
        console.error('Error loading mission:', error);
        setMission(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMission();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">{t('missions.missionNotFound') || 'Mission not found'}</p>
            <Button
              onClick={() => router.visit('/missions')}
              style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            >
              {t('missions.backToMissions') || 'Back to Missions'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/missions')}
          variant="secondary"
          className="mb-6 flex items-center space-x-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>{t('missions.back') || 'Back to Missions'}</span>
        </Button>

        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                <FaBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{mission.title}</h1>
            </div>
            
            {mission.company && (
              <p className="text-lg text-gray-600 mb-2">
                {t('missions.company')}: <span className="font-semibold text-gray-900">{mission.company.name}</span>
              </p>
            )}
            
            {mission.postedDate && (
              <p className="text-sm text-gray-500">
                {t('postMission.posted')}: {formatMissionDate(mission.postedDate, i18n.language)}
              </p>
            )}
          </div>

          {mission.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('postMission.form.description')}</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{mission.description}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.linkHover}15` }}>
                <FaEuroSign className="w-5 h-5" style={{ color: colors.linkHover }} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('postMission.form.budget')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {mission.minBudget !== undefined && mission.maxBudget !== undefined
                    ? `${mission.minBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} - ${mission.maxBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                    : mission.budget
                      ? `${mission.budget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                      : '0'} €
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.linkHover}15` }}>
                <FaClock className="w-5 h-5" style={{ color: colors.linkHover }} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('postMission.form.durationDays')}</p>
                <p className="text-xl font-bold text-gray-900">{mission.durationDays} {t('postMission.days')}</p>
              </div>
            </div>

            {mission.location && (
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.linkHover}15` }}>
                  <FaMapMarkerAlt className="w-5 h-5" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('postMission.form.location')}</p>
                  <p className="text-lg font-semibold text-gray-900">{t(`postMission.locations.${mission.location}`) || mission.location}</p>
                </div>
              </div>
            )}

            {mission.startDate && (
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.linkHover}15` }}>
                  <FaCalendarAlt className="w-5 h-5" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('postMission.form.startDate')}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatMissionDate(mission.startDate, i18n.language)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {(mission.section || (mission.requirements && mission.requirements.length > 0)) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('postMission.requirementsTitle')}</h2>
              <div className="flex flex-wrap gap-3">
                {mission.section && (
                  <span
                    className="px-4 py-2 text-sm rounded-full font-medium"
                    style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                  >
                    {getSectorOptions(t).find(opt => opt.value === mission.section)?.label || mission.section}
                  </span>
                )}
                {mission.requirements && mission.requirements.length > 0 && mission.requirements.map((req, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm rounded-full font-medium"
                    style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionViewFromRequest;

