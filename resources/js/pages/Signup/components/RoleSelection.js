import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiBriefcase, HiIdentification } from 'react-icons/hi';
import { colors } from '../../../constants/colors';

const RoleSelection = ({ selectedRole, onSelectRole }) => {
  const { t } = useTranslation();

  if (selectedRole) {
    return (
      <div className="mb-8">
        <div className={`w-full p-4 rounded-lg border-2 ${
          selectedRole === 'company'
            ? 'border-blue-500 bg-blue-50'
            : 'border-green-500 bg-green-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              selectedRole === 'company' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {selectedRole === 'company' ? (
                <HiBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
              ) : (
                <HiIdentification className="w-6 h-6" style={{ color: '#10b981' }} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedRole === 'company' ? t('signup.forCompany') : t('signup.forExpert')}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedRole === 'company' ? t('signup.companyDesc') : t('signup.expertDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-3">
      <button
        type="button"
        onClick={() => onSelectRole('company')}
        className="w-full p-4 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-blue-500 hover:bg-blue-50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <HiBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('signup.forCompany')}</h3>
            <p className="text-sm text-gray-600">{t('signup.companyDesc')}</p>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onSelectRole('expert')}
        className="w-full p-4 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-green-500 hover:bg-green-50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <HiIdentification className="w-6 h-6" style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('signup.forExpert')}</h3>
            <p className="text-sm text-gray-600">{t('signup.expertDesc')}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default RoleSelection;

