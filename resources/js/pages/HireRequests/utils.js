import { userDB } from '../../utils/database';
import { missionsDB } from '../PostMission/db';

export const enrichHireRequest = async (request, userRole) => {
  const allUsers = await userDB.getAllUsers();
  const allMissions = await missionsDB.getAllMissions();
  
  if (request.type === 'hire') {
    const company = allUsers.find(u => u.id === request.companyId);
    const expert = allUsers.find(u => u.id === request.expertId);
    const mission = request.missionId ? allMissions.find(m => m.id === request.missionId) : null;
    
    if (userRole === 'company') {
      return {
        ...request,
        expert: expert ? {
          id: expert.id,
          name: expert.personalInfo?.firstname && expert.personalInfo?.lastname
            ? `${expert.personalInfo.firstname} ${expert.personalInfo.lastname}`
            : expert.email,
          email: expert.email,
        } : null,
        company: company ? {
          id: company.id,
          name: company.companyInfo?.name || company.email,
          email: company.email,
        } : null,
        mission: mission || null,
      };
    } else if (userRole === 'expert') {
      return {
        ...request,
        company: company ? {
          id: company.id,
          name: company.companyInfo?.name || company.email,
          email: company.email,
        } : null,
        expert: expert ? {
          id: expert.id,
          name: expert.personalInfo?.firstname && expert.personalInfo?.lastname
            ? `${expert.personalInfo.firstname} ${expert.personalInfo.lastname}`
            : expert.email,
          email: expert.email,
        } : null,
        mission: mission || null,
      };
    }
  } else if (request.type === 'application') {
    const company = allUsers.find(u => u.id === request.companyId);
    const expert = allUsers.find(u => u.id === request.expertId);
    const mission = request.missionId ? allMissions.find(m => m.id === request.missionId) : null;
    
    if (userRole === 'expert') {
      return {
        ...request,
        company: company ? {
          id: company.id,
          name: company.companyInfo?.name || company.email,
          email: company.email,
        } : null,
        expert: expert ? {
          id: expert.id,
          name: expert.personalInfo?.firstname && expert.personalInfo?.lastname
            ? `${expert.personalInfo.firstname} ${expert.personalInfo.lastname}`
            : expert.email,
          email: expert.email,
        } : null,
        mission: mission || null,
      };
    } else if (userRole === 'company') {
      return {
        ...request,
        expert: expert ? {
          id: expert.id,
          name: expert.personalInfo?.firstname && expert.personalInfo?.lastname
            ? `${expert.personalInfo.firstname} ${expert.personalInfo.lastname}`
            : expert.email,
          email: expert.email,
        } : null,
        company: company ? {
          id: company.id,
          name: company.companyInfo?.name || company.email,
          email: company.email,
        } : null,
        mission: mission || null,
      };
    }
  }
  
  return request;
};

export const convertHireRequestToMissionFormat = (enrichedRequest, userRole) => {
  if (enrichedRequest.type === 'hire') {
    return {
      id: enrichedRequest.id,
      missionId: enrichedRequest.missionId || null,
      companyId: enrichedRequest.companyId,
      expertId: enrichedRequest.expertId,
      status: enrichedRequest.status,
      startDate: '',
      endDate: null,
      createdAt: enrichedRequest.createdAt,
      updatedAt: enrichedRequest.updatedAt,
      isHireRequest: true,
      hireRequest: enrichedRequest,
      mission: enrichedRequest.mission || null,
      company: enrichedRequest.company,
      expert: enrichedRequest.expert,
    };
  }
  return null;
};

export const convertApplicationRequestToMissionFormat = (enrichedRequest, userRole) => {
  if (enrichedRequest.type === 'application') {
    return {
      id: enrichedRequest.id,
      missionId: enrichedRequest.missionId || null,
      companyId: enrichedRequest.companyId,
      expertId: enrichedRequest.expertId,
      status: enrichedRequest.status,
      startDate: '',
      endDate: null,
      createdAt: enrichedRequest.createdAt,
      updatedAt: enrichedRequest.updatedAt,
      isApplicationRequest: true,
      applicationRequest: enrichedRequest,
      mission: enrichedRequest.mission || null,
      company: enrichedRequest.company,
      expert: enrichedRequest.expert,
    };
  }
  return null;
};

