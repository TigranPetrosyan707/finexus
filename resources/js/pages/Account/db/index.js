import { db } from '../../../utils/database';
import { userDB } from '../../../utils/database';

export const accountDB = {
  async getCurrentUser() {
    const user = await db.get('currentUser');
    return user;
  },

  async updatePassword(userId, oldPassword, newPassword) {
    const users = await userDB.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== oldPassword) {
      throw new Error('Current password is incorrect');
    }

    const updatedUser = await userDB.updateUser(userId, { password: newPassword });
    
    if (updatedUser) {
      await db.set('currentUser', updatedUser);
    }
    
    return updatedUser;
  },

  async updateCompanyInfo(userId, companyInfo) {
    const users = await userDB.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user || user.role !== 'company') {
      throw new Error('User not found or not a company');
    }

    const updatedUser = await userDB.updateUser(userId, {
      companyInfo: {
        ...user.companyInfo,
        name: companyInfo.name,
        sector: companyInfo.sector || null,
        otherSector: companyInfo.otherSector || null,
        registrationNumber: companyInfo.siret || null,
        country: companyInfo.country,
        otherCountry: companyInfo.otherCountry || null,
      },
    });
    
    if (updatedUser) {
      await db.set('currentUser', updatedUser);
    }
    
    return updatedUser;
  },

  async updateUserInfo(userId, userInfo, userRole) {
    const users = await userDB.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    let updatedData = {};
    
    if (userRole === 'company') {
      updatedData = {
        managerInfo: {
          ...user.managerInfo,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          phone: userInfo.phone,
          role: userInfo.role || user.managerInfo?.role || '',
        },
        email: userInfo.email,
      };
    } else if (userRole === 'expert') {
      updatedData = {
        personalInfo: {
          ...user.personalInfo,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          phone: userInfo.phone,
        },
        email: userInfo.email,
      };
    }

    const updatedUser = await userDB.updateUser(userId, updatedData);
    
    if (updatedUser) {
      await db.set('currentUser', updatedUser);
    }
    
    return updatedUser;
  },
};

