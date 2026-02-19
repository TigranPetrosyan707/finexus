import React from 'react';
import { FaUser, FaStar, FaCheckCircle, FaEdit } from 'react-icons/fa';
import Button from '../../../components/UI/Button/Button';

const ProfileHeader = ({ profile, isEditing, onEdit, t }) => {
  if (!profile) return null;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="w-10 h-10 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            {profile.verified && (
              <FaCheckCircle className="w-6 h-6 text-green-500" title={t('expertProfile.verified')} />
            )}
          </div>
          {profile.profession && (
            <p className="text-lg text-gray-600">{profile.profession}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <FaStar className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{profile.rating.toFixed(1)}</span>
            <span className="text-gray-600">({profile.reviews} {t('expertProfile.reviews')})</span>
          </div>
        </div>
      </div>
      {!isEditing && onEdit && (
        <Button onClick={onEdit} className="flex items-center space-x-2">
          <FaEdit className="w-4 h-4" />
          <span>{t('expertProfile.edit')}</span>
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;

