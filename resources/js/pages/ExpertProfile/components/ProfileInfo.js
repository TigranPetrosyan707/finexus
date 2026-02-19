import React from 'react';
import { FaLinkedin, FaBriefcase, FaStar, FaFileAlt } from 'react-icons/fa';
import { colors } from '../../../constants/colors';

const ProfileInfo = ({ profile, t, i18n }) => {
  if (!profile) return null;

  const formatLinkedInUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.email')}</label>
          <p className="text-gray-900">{profile.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.phone')}</label>
          <p className="text-gray-900">{profile.phone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.experience')}</label>
          <p className="text-gray-900">{profile.experienceYears} {t('searchExperts.years')}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.dailyRate')}</label>
          <p className="text-gray-900">
            {profile.dailyRate?.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} €/{t('expertProfile.perDay')}
          </p>
        </div>
        {profile.linkedin && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.linkedin')}</label>
            <a
              href={formatLinkedInUrl(profile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center space-x-2"
            >
              <FaLinkedin className="w-4 h-4" />
              <span>{profile.linkedin}</span>
            </a>
          </div>
        )}
      </div>

      {profile.description && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.description')}</label>
          <p className="text-gray-700">{profile.description}</p>
        </div>
      )}

      {profile.specialties && profile.specialties.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('expertProfile.specialties')}</label>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm rounded-full"
                style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <FaBriefcase className="w-5 h-5" style={{ color: colors.linkHover }} />
            <span className="text-sm font-medium text-gray-700">{t('expertProfile.completedMissions')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{profile.completedMissions}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <FaStar className="w-5 h-5" style={{ color: colors.linkHover }} />
            <span className="text-sm font-medium text-gray-700">{t('expertProfile.rating')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{profile.rating.toFixed(1)}/5</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <FaFileAlt className="w-5 h-5" style={{ color: colors.linkHover }} />
            <span className="text-sm font-medium text-gray-700">{t('expertProfile.reviews')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{profile.reviews}</p>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;

