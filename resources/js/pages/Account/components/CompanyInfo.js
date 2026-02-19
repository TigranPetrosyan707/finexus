import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBuilding, FaEdit } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import { getCountryName } from '../utils';

const CompanyInfo = ({ companyInfo, onEdit, t }) => {
  const { i18n } = useTranslation();
  if (!companyInfo || !companyInfo.name) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
            <FaBuilding className="w-6 h-6" style={{ color: colors.linkHover }} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('account.companyInfo')}
          </h2>
        </div>
        <Button onClick={onEdit} variant="secondary" className="flex items-center space-x-2">
          <FaEdit className="w-4 h-4" />
          <span>{t('account.edit')}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companyInfo.name && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.companyName')}:</strong>
            <span className="text-base text-gray-900">{companyInfo.name}</span>
          </div>
        )}
        {companyInfo.siret && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.siret')}:</strong>
            <span className="text-base text-gray-900">{companyInfo.siret}</span>
          </div>
        )}
        {companyInfo.country && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.country')}:</strong>
            <span className="text-base text-gray-900">{getCountryName(companyInfo.country, i18n.language)}</span>
          </div>
        )}
        {companyInfo.address && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.address')}:</strong>
            <span className="text-base text-gray-900">{companyInfo.address}</span>
          </div>
        )}
        {companyInfo.sector && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.sector')}:</strong>
            <span className="text-base text-gray-900">{companyInfo.sector}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;

