import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdBadge } from 'react-icons/md';
import { colors } from '../../constants/colors';
import { useExpertProfile } from './hooks/useExpertProfile';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import ProfileForm from './components/ProfileForm';

const ExpertProfile = () => {
  const { t, i18n } = useTranslation();
  const {
    profile,
    isEditing,
    isUpdating,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleEdit,
    handleCancel,
  } = useExpertProfile(t);

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
                {t('expertProfile.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <MdBadge className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('expertProfile.subtitle')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
          {isEditing ? (
            <ProfileForm
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              onCancel={handleCancel}
              isLoading={isUpdating}
              t={t}
            />
          ) : (
            <>
              <ProfileHeader
                profile={profile}
                isEditing={isEditing}
                onEdit={handleEdit}
                t={t}
              />
              <ProfileInfo
                profile={profile}
                t={t}
                i18n={i18n}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;

