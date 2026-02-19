import localforage from 'localforage';

localforage.config({
  name: 'FinanceManagement',
  storeName: 'finance_db',
  description: 'Local database for Finance Management App'
});

export const db = {
  async get(key) {
    try {
      return await localforage.getItem(key);
    } catch (err) {
      console.error('Error getting data:', err);
      return null;
    }
  },

  async set(key, value) {
    try {
      await localforage.setItem(key, value);
      return true;
    } catch (err) {
      console.error('Error setting data:', err);
      return false;
    }
  },

  async remove(key) {
    try {
      await localforage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Error removing data:', err);
      return false;
    }
  },

  async clear() {
    try {
      await localforage.clear();
      return true;
    } catch (err) {
      console.error('Error clearing data:', err);
      return false;
    }
  },

  async getAllKeys() {
    try {
      return await localforage.keys();
    } catch (err) {
      console.error('Error getting keys:', err);
      return [];
    }
  }
};

export const userDB = {
  async createUser(userData) {
    const users = await db.get('users') || [];
    
    if (!userData.role) {
      throw new Error('Role is required when creating a user');
    }

    const existingUser = await this.getUserByEmailAndRole(userData.email, userData.role);
    if (existingUser) {
      throw new Error(`User with email ${userData.email} and role ${userData.role} already exists`);
    }

    const newUser = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await db.set('users', users);
    return newUser;
  },

  async getUserByEmail(email) {
    const users = await db.get('users') || [];
    return users.find(user => user.email === email);
  },

  async getUserByEmailAndRole(email, role) {
    const users = await db.get('users') || [];
    return users.find(user => user.email === email && user.role === role);
  },

  async getUserById(id) {
    const users = await db.get('users') || [];
    return users.find(user => user.id === id);
  },

  async updateUser(id, updates) {
    const users = await db.get('users') || [];
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      await db.set('users', users);
      return users[index];
    }
    return null;
  },

  async getAllUsers() {
    return await db.get('users') || [];
  },

  async deleteUser(id) {
    const users = await db.get('users') || [];
    const filtered = users.filter(user => user.id !== id);
    await db.set('users', filtered);
    return true;
  }
};

export default db;

