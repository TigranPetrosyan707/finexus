import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaEuroSign, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaBriefcase } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import { formatMissionDate, getSectorOptions } from '../PostMission/utils';
import { availableMissionsDB } from './db';

const MissionDetails = ({ id }) => {
  const { t, i18n } = useTranslation();
  const [mission, setMission] = useState(null);
  const [companyMissions, setCompanyMissions] = useState([]);

  useEffect(() => {
    const loadMission = async () => {
      try {
        const allMissions = await availableMissionsDB.getAllAvailableMissions();
        const foundMission = allMissions.find(m => m.id === id);
        
        if (foundMission) {
          setMission(foundMission);
          
          const otherMissions = allMissions.filter(
            m => m.id !== id && m.companyId === foundMission.companyId
          );
          setCompanyMissions(otherMissions);
        } else {
          setMission(null);
        }
      } catch (error) {
        console.error('Error loading mission:', error);
        setMission(null);
      }
    };

    if (id) {
      loadMission();
    }
  }, [id]);


  if (!mission) {
    return (
      <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600">{t('availableMissions.missionNotFound') || 'Mission not found'}</p>
            <Button
              onClick={() => router.visit('/available-missions')}
              className="mt-4"
              style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            >
              {t('availableMissions.backToMissions') || 'Back to Missions'}
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
          onClick={() => navigate('/available-missions')}
          variant="secondary"
          className="mb-6 flex items-center space-x-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>{t('availableMissions.back') || 'Back'}</span>
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-6">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{mission.title}</h1>
                {mission.company && (
                  <p className="text-lg text-gray-600 mb-2">
                    {t('availableMissions.company')}: <span className="font-semibold">{mission.company.name}</span>
                  </p>
                )}
                {mission.postedDate && (
                  <p className="text-sm text-gray-600 mb-4">
                    {t('postMission.posted')}: {formatMissionDate(mission.postedDate, i18n.language)}
                  </p>
                )}
              </div>

              {mission.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('postMission.form.description')}</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{mission.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <FaEuroSign className="w-5 h-5" style={{ color: colors.linkHover }} />
                  <div>
                    <p className="text-sm text-gray-500">{t('postMission.form.budget')}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {mission.minBudget !== undefined && mission.maxBudget !== undefined
                        ? `${mission.minBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} - ${mission.maxBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                        : mission.budget
                          ? `${mission.budget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                          : '0'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaClock className="w-5 h-5" style={{ color: colors.linkHover }} />
                  <div>
                    <p className="text-sm text-gray-500">{t('postMission.form.durationDays')}</p>
                    <p className="text-lg font-semibold text-gray-900">{mission.durationDays} {t('postMission.days')}</p>
                  </div>
                </div>
                {mission.location && (
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="w-5 h-5" style={{ color: colors.linkHover }} />
                    <div>
                      <p className="text-sm text-gray-500">{t('postMission.form.location')}</p>
                      <p className="text-lg font-semibold text-gray-900">{t(`postMission.locations.${mission.location}`)}</p>
                    </div>
                  </div>
                )}
                {mission.startDate && (
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-5 h-5" style={{ color: colors.linkHover }} />
                    <div>
                      <p className="text-sm text-gray-500">{t('postMission.form.startDate')}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatMissionDate(mission.startDate, i18n.language)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(mission.section || (mission.requirements && mission.requirements.length > 0)) && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('postMission.requirementsTitle')}</h2>
                  <div className="flex flex-wrap gap-2">
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

              <div className="pt-6 border-t border-gray-200">
                <Button
                  className="w-full md:w-auto"
                  style={{ backgroundColor: colors.linkHover, color: '#fff' }}
                >
                  {t('availableMissions.apply')}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="w-5 h-5" style={{ color: colors.linkHover }} />
                {t('availableMissions.otherMissions') || 'Other Missions'}
              </h2>
              {companyMissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    {t('availableMissions.noOtherMissions') || 'This company does not have any other missions.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyMissions.map((otherMission) => (
                    <div
                      key={otherMission.id}
                      onClick={() => router.visit(`/available-missions/${otherMission.id}`)}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{otherMission.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                        <FaEuroSign className="w-3 h-3" style={{ color: colors.linkHover }} />
                        <span>
                          {otherMission.minBudget !== undefined && otherMission.maxBudget !== undefined
                            ? `${otherMission.minBudget} - ${otherMission.maxBudget}`
                            : otherMission.budget || '0'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <FaClock className="w-3 h-3" style={{ color: colors.linkHover }} />
                        <span>{otherMission.durationDays} {t('postMission.days')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetails;

