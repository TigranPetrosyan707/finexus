import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import { useExpertDetails } from './hooks/useExpertDetails';
import { useHireRequest } from '../HireRequests/hooks/useHireRequest';
import ProfileHeader from '../ExpertProfile/components/ProfileHeader';
import ProfileInfo from '../ExpertProfile/components/ProfileInfo';
import SelectMissionModal from './components/SelectMissionModal';
import Button from '../../components/UI/Button/Button';

const ExpertDetails = ({ id }) => {
  const { t, i18n } = useTranslation();
  const { profile, loading } = useExpertDetails(id, t);
  const {
    loading: hireRequestLoading,
    isSending,
    currentUser,
    sendHireRequest,
    companyMissions,
    missionStatuses,
  } = useHireRequest(id);

  const [showMissionModal, setShowMissionModal] = useState(false);

  const handleSendHireRequest = () => {
    if (companyMissions.length === 0) {
      return;
    }
    setShowMissionModal(true);
  };

  const handleMissionSelect = async (missionId) => {
    const success = await sendHireRequest(missionId);
    if (success) {
      setShowMissionModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowMissionModal(false);
  };

  const buttonContent = {
    text: t('expertDetails.sendHireRequest') || 'Send Hire Request',
    icon: FaUserPlus,
    disabled: companyMissions.length === 0,
    style: { backgroundColor: colors.linkHover, color: '#fff' },
  };
  const ButtonIcon = buttonContent.icon;

  if (loading) {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">{t('expertDetails.notFound') || 'Expert not found'}</p>
            <Button
              onClick={() => router.visit('/search-experts')}
              style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            >
              {t('expertDetails.backToSearch') || 'Back to Search Experts'}
            </Button>
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
        <div className="mb-6">
          <Button
            onClick={() => navigate('/search-experts')}
            className="flex items-center space-x-2 mb-4"
            style={{ backgroundColor: colors.linkHover, color: '#fff' }}
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>{t('expertDetails.back') || 'Back'}</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
          <ProfileHeader
            profile={profile}
            isEditing={false}
            onEdit={null}
            t={t}
          />
          <ProfileInfo
            profile={profile}
            t={t}
            i18n={i18n}
          />
          {currentUser && currentUser.role === 'company' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSendHireRequest}
                disabled={buttonContent.disabled || isSending || hireRequestLoading}
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 text-base font-semibold"
                style={buttonContent.style}
              >
                <ButtonIcon className="w-5 h-5" />
                <span>
                  {isSending
                    ? t('expertDetails.sending') || 'Sending...'
                    : buttonContent.text}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <SelectMissionModal
        isOpen={showMissionModal}
        onClose={handleCloseModal}
        missions={companyMissions}
        onSelect={handleMissionSelect}
        missionStatuses={missionStatuses}
        t={t}
      />
    </div>
  );
};

export default ExpertDetails;

