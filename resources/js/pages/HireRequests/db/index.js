import { db } from '../../../utils/database';
import { createHireRequestSchema, createApplicationRequestSchema } from './schema';

export const hireRequestsDB = {
  async getAllHireRequests() {
    const requests = await db.get('hireRequests') || [];
    return requests;
  },

  async getHireRequestById(id) {
    const requests = await db.get('hireRequests') || [];
    return requests.find(request => request.id === id);
  },

  async getHireRequestsByCompanyId(companyId) {
    const requests = await db.get('hireRequests') || [];
    return requests.filter(request => 
      request.companyId === companyId && request.type === 'hire'
    );
  },

  async getHireRequestsByExpertId(expertId) {
    const requests = await db.get('hireRequests') || [];
    return requests.filter(request => 
      request.expertId === expertId && request.type === 'hire'
    );
  },

  async getHireRequestByCompanyAndExpert(companyId, expertId) {
    const requests = await db.get('hireRequests') || [];
    return requests.find(request => 
      request.companyId === companyId && 
      request.expertId === expertId && 
      request.type === 'hire'
    );
  },

  async getHireRequestByCompanyExpertAndMission(companyId, expertId, missionId) {
    const requests = await db.get('hireRequests') || [];
    return requests.find(request => 
      request.companyId === companyId && 
      request.expertId === expertId && 
      request.missionId === missionId &&
      request.type === 'hire'
    );
  },

  async createHireRequest(companyId, expertId, missionId) {
    const requests = await db.get('hireRequests') || [];
    // Check if there's already a request for this specific mission
    const existingRequest = await this.getHireRequestByCompanyExpertAndMission(companyId, expertId, missionId);
    
    if (existingRequest) {
      return existingRequest;
    }

    const requestData = createHireRequestSchema(companyId, expertId, missionId);
    requests.push(requestData);
    await db.set('hireRequests', requests);
    return requestData;
  },

  async updateHireRequestStatus(id, status, respondedBy = null) {
    const requests = await db.get('hireRequests') || [];
    const index = requests.findIndex(request => request.id === id);
    
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status: status,
        respondedBy: respondedBy || requests[index].respondedBy,
        updatedAt: new Date().toISOString(),
      };
      await db.set('hireRequests', requests);
      return requests[index];
    }
    return null;
  },

  async acceptHireRequest(id, userId) {
    return await this.updateHireRequestStatus(id, 'accepted', userId);
  },

  async rejectHireRequest(id, userId, rejectionReason = null) {
    const updatedRequest = await this.updateHireRequestStatus(id, 'rejected', userId);
    if (updatedRequest && rejectionReason) {
      const requests = await db.get('hireRequests') || [];
      const index = requests.findIndex(request => request.id === id);
      if (index !== -1) {
        requests[index] = {
          ...requests[index],
          rejectionReason: rejectionReason,
        };
        await db.set('hireRequests', requests);
        return requests[index];
      }
    }
    return updatedRequest;
  },

  async getApplicationRequestsByExpertId(expertId) {
    const requests = await db.get('hireRequests') || [];
    return requests.filter(request => 
      request.expertId === expertId && request.type === 'application'
    );
  },

  async getApplicationRequestsByCompanyId(companyId) {
    const requests = await db.get('hireRequests') || [];
    return requests.filter(request => 
      request.companyId === companyId && request.type === 'application'
    );
  },

  async getApplicationRequestByExpertAndMission(expertId, missionId) {
    const requests = await db.get('hireRequests') || [];
    return requests.find(request => 
      request.expertId === expertId && 
      request.missionId === missionId && 
      request.type === 'application'
    );
  },

  async createApplicationRequest(expertId, companyId, missionId) {
    const requests = await db.get('hireRequests') || [];
    const existingRequest = await this.getApplicationRequestByExpertAndMission(expertId, missionId);
    
    if (existingRequest) {
      return existingRequest;
    }

    const requestData = createApplicationRequestSchema(expertId, companyId, missionId);
    requests.push(requestData);
    await db.set('hireRequests', requests);
    return requestData;
  },

  async acceptApplicationRequest(id, userId) {
    return await this.updateHireRequestStatus(id, 'accepted', userId);
  },

  async rejectApplicationRequest(id, userId, rejectionReason = null) {
    const updatedRequest = await this.updateHireRequestStatus(id, 'rejected', userId);
    if (updatedRequest && rejectionReason) {
      const requests = await db.get('hireRequests') || [];
      const index = requests.findIndex(request => request.id === id);
      if (index !== -1) {
        requests[index] = {
          ...requests[index],
          rejectionReason: rejectionReason,
        };
        await db.set('hireRequests', requests);
        return requests[index];
      }
    }
    return updatedRequest;
  },
};

