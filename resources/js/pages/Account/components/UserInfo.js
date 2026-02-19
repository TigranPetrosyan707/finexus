import React from 'react';
import { FaUser, FaEdit } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';

const UserInfo = ({ userInfo, userRole, onEdit, t }) => {
  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.buttonBackground}15` }}>
            <FaUser className="w-6 h-6" style={{ color: colors.buttonBackground }} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {userRole === 'expert' ? t('account.expertInfo') : t('account.userInfo')}
          </h2>
        </div>
        <Button onClick={onEdit} variant="secondary" className="flex items-center space-x-2">
          <FaEdit className="w-4 h-4" />
          <span>{t('account.edit')}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userInfo.lastname && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.lastname')}:</strong>
            <span className="text-base text-gray-900">{userInfo.lastname}</span>
          </div>
        )}
        {userInfo.firstname && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.firstname')}:</strong>
            <span className="text-base text-gray-900">{userInfo.firstname}</span>
          </div>
        )}
        {userInfo.email && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.email')}:</strong>
            <span className="text-base text-gray-900">{userInfo.email}</span>
          </div>
        )}
        {userInfo.phone && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.phone')}:</strong>
            <span className="text-base text-gray-900">{userInfo.phone}</span>
          </div>
        )}
        {userInfo.role && (
          <div className="p-4 rounded-lg bg-gray-50">
            <strong className="text-sm font-semibold text-gray-700 block mb-1">{t('account.role')}:</strong>
            <span className="text-base text-gray-900">{userInfo.role}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;

