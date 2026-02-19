import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHandshakeAngle } from 'react-icons/fa6';
import { colors } from '../../constants/colors';
import Input from '../../components/UI/Input/Input';
import { useMyExperts } from './hooks/useMyExperts';
import ExpertList from './components/ExpertList';

const MyExperts = () => {
  const { t } = useTranslation();
  const { experts, allExperts, searchQuery, setSearchQuery } = useMyExperts();

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
                {t('myExperts.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaHandshakeAngle className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('myExperts.subtitle')}
            </p>
          </div>
        </div>

        {allExperts.length > 0 && (
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={t('myExperts.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <ExpertList experts={experts} t={t} />
      </div>
    </div>
  );
};

export default MyExperts;

