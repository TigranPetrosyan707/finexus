import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiBriefcase, HiIdentification, HiTranslate, HiDesktopComputer } from 'react-icons/hi';
import { useLanguage } from '../../hooks/useLanguage';
import { useLoginForm } from './db';
import { createLoginSchema } from './validation';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';

const Login = () => {
  const { t } = useTranslation();
  const {
    languages,
    currentLanguage,
    isLanguageOpen,
    setIsLanguageOpen,
    changeLanguage,
    languageMenuRef,
    currentLanguageCode,
  } = useLanguage();
  
  const { loading, selectedRole, setSelectedRole, handleLogin } = useLoginForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(createLoginSchema(t)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (data) => {
    await handleLogin(data, setFormError, t);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200 relative">
          <div className="absolute top-4 right-4" ref={languageMenuRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <HiTranslate className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentLanguage.abbreviation}</span>
            </button>
            
            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (currentLanguageCode !== lang.code) {
                        changeLanguage(lang.code);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      currentLanguageCode === lang.code
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="whitespace-nowrap">{lang.name}</span>
                    <span className="text-sm font-semibold whitespace-nowrap">{lang.abbreviation}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            {t('login.title')}
          </h1>

          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={() => setSelectedRole('company')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedRole === 'company'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <HiBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('login.forCompany')}</h3>
                  <p className="text-sm text-gray-600">{t('login.companyDesc')}</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('expert')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedRole === 'expert'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <HiIdentification className="w-6 h-6" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('login.forExpert')}</h3>
                  <p className="text-sm text-gray-600">{t('login.expertDesc')}</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('demo')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedRole === 'demo'
                  ? 'border-buttonBackground bg-yellow-50'
                  : 'border-gray-200 hover:border-buttonBackground hover:bg-yellow-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <HiDesktopComputer className="w-6 h-6" style={{ color: colors.buttonBackground }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('login.forDemo')}</h3>
                  <p className="text-sm text-gray-600">{t('login.demoDesc')}</p>
                </div>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}
            {errors.role && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.role.message}
              </div>
            )}
            <div>
              <Input
                id="loginEmail"
                type="email"
                placeholder={t('login.email')}
                disabled={!selectedRole}
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                id="loginPassword"
                type="password"
                placeholder={t('login.password')}
                disabled={!selectedRole}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={!selectedRole || loading}>
              {loading ? (t('login.loading') || 'Loading...') : t('login.submit')}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-gray-600">
              {t('login.noAccount')}{' '}
              <Link
                href="/signup"
                className="font-bold transition-colors hover:opacity-80"
                style={{ color: colors.buttonBackground }}
              >
                {t('login.createAccount')}
              </Link>
            </p>
            <p className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('login.forgotPassword')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
