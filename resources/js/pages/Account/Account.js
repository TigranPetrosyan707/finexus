import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import { sectorOptions } from '../../constants/formOptions';
import { getAllCountries, getTranslatedOptions } from '../Signup/utils';
import { useAccount } from './hooks/useAccount';
import CompanyInfo from './components/CompanyInfo';
import CompanyInfoForm from './components/CompanyInfoForm';
import UserInfo from './components/UserInfo';
import UserInfoForm from './components/UserInfoForm';
import PasswordForm from './components/PasswordForm';

const Account = () => {
  const { t, i18n } = useTranslation();
  const { userRole } = useAuth();
  const allCountries = useMemo(() => getAllCountries(i18n), [i18n]);
  const translatedSectorOptions = useMemo(
    () => getTranslatedOptions(sectorOptions, i18n),
    [i18n]
  );
  const {
    companyInfo,
    userInfo,
    showPasswordForm,
    showCompanyForm,
    showUserForm,
    isUpdatingPassword,
    isUpdatingCompany,
    isUpdatingUser,
    passwordForm,
    companyForm,
    userForm,
    handlePasswordSubmit,
    handleCompanySubmit,
    handleUserSubmit,
    handleCancelPassword,
    handleCancelCompany,
    handleCancelUser,
    handleShowPasswordForm,
    handleShowCompanyForm,
    handleShowUserForm,
  } = useAccount(t, userRole);


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
                {t('account.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaUserCircle className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('account.subtitle')}
            </p>
          </div>
        </div>

        {userRole === 'company' && (
          <>
            {showCompanyForm ? (
              <CompanyInfoForm
                register={companyForm.register}
                control={companyForm.control}
                errors={companyForm.errors}
                handleSubmit={companyForm.handleSubmit}
                onSubmit={handleCompanySubmit}
                onCancel={handleCancelCompany}
                watchedCountry={companyForm.watch('country')}
                watchedSector={companyForm.watch('sector')}
                allCountries={allCountries}
                translatedSectorOptions={translatedSectorOptions}
                isLoading={isUpdatingCompany}
                t={t}
              />
            ) : (
              companyInfo && (
                <CompanyInfo companyInfo={companyInfo} onEdit={handleShowCompanyForm} t={t} />
              )
            )}
          </>
        )}

        {showUserForm ? (
          <UserInfoForm
            register={userForm.register}
            errors={userForm.errors}
            handleSubmit={userForm.handleSubmit}
            onSubmit={handleUserSubmit}
            onCancel={handleCancelUser}
            userRole={userRole}
            isLoading={isUpdatingUser}
            t={t}
          />
        ) : (
          userInfo && (
            <UserInfo userInfo={userInfo} userRole={userRole} onEdit={handleShowUserForm} t={t} />
          )
        )}

        <PasswordForm
          register={passwordForm.register}
          handleSubmit={passwordForm.handleSubmit}
          errors={passwordForm.errors}
          onSubmit={handlePasswordSubmit}
          onCancel={handleCancelPassword}
          showForm={showPasswordForm}
          onShowForm={handleShowPasswordForm}
          isLoading={isUpdatingPassword}
          t={t}
        />
      </div>
    </div>
  );
};

export default Account;
