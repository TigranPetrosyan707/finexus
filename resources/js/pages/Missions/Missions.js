import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FaBriefcase } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import { useMissions } from './hooks/useMissions';
import MissionList from './components/MissionList';

const Missions = () => {
  const { t, i18n } = useTranslation();
  const { userRole } = useAuth();
  const { missions, activeTab, setActiveTab, loadMissions } = useMissions(userRole);

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
                {t('missions.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('missions.subtitle')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'active' ? { backgroundColor: colors.linkHover } : {}}
            >
              {t('missions.tabs.active')}
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'pending' ? { backgroundColor: colors.linkHover } : {}}
            >
              {t('missions.tabs.pending')}
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'rejected' ? { backgroundColor: colors.linkHover } : {}}
            >
              {t('missions.tabs.rejected')}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'completed' ? { backgroundColor: colors.linkHover } : {}}
            >
              {t('missions.tabs.completed')}
            </button>
          </div>

          <MissionList 
            missions={missions} 
            userRole={userRole} 
            t={t} 
            i18n={i18n}
            onStatusChange={loadMissions}
          />
        </div>
      </div>
    </div>
  );
};

export default Missions;

