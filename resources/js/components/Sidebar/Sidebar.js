import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useSidebar } from '../../context/SidebarContext';
import { HiMenu, HiX, HiUser, HiUsers, HiLogout, HiTranslate, HiSearch, HiBriefcase, HiChat, HiCollection, HiIdentification, HiDocumentAdd, HiChevronDoubleLeft, HiChevronDoubleRight, HiReceiptTax, HiDocument, HiCalendar } from 'react-icons/hi';
import { RiDashboardHorizontalFill } from 'react-icons/ri';
import { colors } from '../../constants/colors';
import Logo from '../Logo/Logo';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { url } = usePage();
  const { logout, userRole } = useAuth();
  const { t, i18n } = useTranslation();
  const {
    languages,
    currentLanguage,
    isLanguageOpen,
    setIsLanguageOpen,
    changeLanguage,
    languageMenuRef,
    currentLanguageCode,
  } = useLanguage();

  const companyMenuItems = [
    { path: '/search-experts', labelKey: 'common.searchExperts', icon: HiSearch },
    { path: '/dashboard', labelKey: 'common.dashboard', icon: RiDashboardHorizontalFill },
    { path: '/post-mission', labelKey: 'common.postMission', icon: HiDocumentAdd },
    { path: '/missions', labelKey: 'common.myMissions', icon: HiBriefcase },
    { path: '/my-experts', labelKey: 'common.myExperts', icon: HiUsers },
    { path: '/invoices', labelKey: 'common.invoices', icon: HiReceiptTax },
    { path: '/documents', labelKey: 'common.documents', icon: HiDocument },
    { path: '/chat', labelKey: 'common.chat', icon: HiChat },
    { path: '/account', labelKey: 'common.account', icon: HiUser },
  ];

  const expertMenuItems = [
    { path: '/dashboard', labelKey: 'common.dashboard', icon: RiDashboardHorizontalFill },
    { path: '/available-missions', labelKey: 'common.availableMissions', icon: HiBriefcase },
    { path: '/missions', labelKey: 'common.myMissions', icon: HiCollection },
    { path: '/mission-calendar', labelKey: 'common.missionCalendar', icon: HiCalendar },
    { path: '/chat', labelKey: 'common.chat', icon: HiChat },
    { path: '/expert-profile', labelKey: 'common.myProfile', icon: HiIdentification },
    { path: '/account', labelKey: 'common.account', icon: HiUser },
  ];

  const menuItems = userRole === 'expert' ? expertMenuItems : companyMenuItems;


  const isActive = (path) => {
    return url === path;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.visit('/login');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <Link
        href={item.path}
        onClick={onClick}
        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? 'text-white font-semibold'
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
        style={active ? { backgroundColor: colors.linkHover } : {}}
        title={isCollapsed ? t(item.labelKey) : ''}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm whitespace-nowrap">{t(item.labelKey)}</span>}
      </Link>
    );
  };

  const defaultPath = userRole === 'expert' ? '/dashboard' : '/search-experts';

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: colors.footerBackground }}>
        <Link href={defaultPath} className="cursor-pointer">
          <Logo showText={true} variant="light" />
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
        style={{ backgroundColor: colors.footerBackground }}
      >
        <div className="flex flex-col h-full relative">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <Link href={defaultPath} className="cursor-pointer">
              <Logo showText={true} variant="light" />
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden lg:flex items-center p-6">
            <Link href={defaultPath} className="cursor-pointer">
              <Logo showText={!isCollapsed} variant="light" />
            </Link>
          </div>

          <nav className={`flex-1 py-2 space-y-2 overflow-hidden ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavItem key={item.path} item={item} onClick={() => setIsMobileOpen(false)} />
              ))}
            </div>
          </nav>

          <div className={`pt-4 pb-4 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <div className="border-t border-white/10 pt-4">
              <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200`}
                title={isCollapsed ? currentLanguage.name : ''}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                  <HiTranslate className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm whitespace-nowrap">{currentLanguage.name}</span>}
                </div>
                {!isCollapsed && <span className="text-sm font-semibold whitespace-nowrap">{currentLanguage.abbreviation}</span>}
              </button>
              
              {isLanguageOpen && (
                <div className={`absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 ${isCollapsed ? 'left-0 right-0' : 'left-0 right-0'}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (currentLanguageCode !== lang.code) {
                          const tForLanguage = i18n.getFixedT(lang.code);
                          changeLanguage(lang.code);
                          toast.success(tForLanguage('language.changed', { language: lang.name }));
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

              <button
                onClick={handleLogoutClick}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200`}
                title={isCollapsed ? t('common.logout') : ''}
              >
                <HiLogout className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm whitespace-nowrap">{t('common.logout')}</span>}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            if (isLanguageOpen) {
              setIsLanguageOpen(false);
            }
          }}
          className="hidden lg:flex absolute top-8 -right-5 items-center justify-center w-7 h-7 rounded-full shadow-lg text-white border-[0.5px] border-white hover:bg-white/10 transition-all duration-200 z-50"
          style={{ backgroundColor: colors.footerBackground }}
          title={isCollapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
        >
          {isCollapsed ? <HiChevronDoubleRight className="w-5 h-5" /> : <HiChevronDoubleLeft className="w-5 h-5" />}
        </button>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-logoutRed-light">
                <HiLogout className="w-6 h-6 text-logoutRed" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('logoutModal.title')}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t('logoutModal.message')}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {t('logoutModal.cancel')}
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all duration-200 shadow-md hover:shadow-lg bg-logoutRed hover:bg-red-500"
              >
                {t('logoutModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;


