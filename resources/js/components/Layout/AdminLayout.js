import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { colors } from '../../constants/colors';

const AdminLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
      <Sidebar />
      <main className={`flex-1 pt-16 lg:pt-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

