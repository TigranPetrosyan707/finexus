import { userDB } from '../../../utils/database';

export const expertsDB = {
  async getAllExperts() {
    const users = await userDB.getAllUsers();
    return users.filter(user => user.role === 'expert');
  },

  async getExpertById(id) {
    return await userDB.getUserById(id);
  },
};

