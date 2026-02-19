import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaBriefcase, FaCheckCircle, FaEuroSign } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';

const ExpertCard = ({ expert, t }) => {
  const navigate = useNavigate();
  
  const initials = expert.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleViewProfile = () => {
    navigate(`/expert/${expert.id}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
            {initials}
          </div>
          {expert.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <FaCheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">{expert.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">{expert.profession || t('searchExperts.noProfession')}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <FaStar className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-gray-900">{expert.rating || 'N/A'}</span>
              {expert.reviews > 0 && (
                <span className="text-gray-500">({expert.reviews})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaBriefcase className="w-4 h-4" />
          <span>{expert.experienceYears} {t('searchExperts.years')}</span>
        </div>
        {expert.dailyRate > 0 && (
          <div className="flex items-center gap-2 text-base font-bold" style={{ color: colors.linkHover }}>
            <FaEuroSign className="w-4 h-4" />
            <span>{expert.dailyRate}/{t('searchExperts.perDay')}</span>
          </div>
        )}
      </div>

      {expert.specialties && expert.specialties.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-xs rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {typeof specialty === 'string' && specialty.startsWith('searchExperts.') 
                  ? t(specialty) 
                  : specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button 
        onClick={handleViewProfile}
        className="w-full group-hover:shadow-md transition-all" 
        style={{ backgroundColor: colors.linkHover, color: '#fff' }}
      >
        {t('searchExperts.viewProfile')}
      </Button>
    </div>
  );
};

export default ExpertCard;

