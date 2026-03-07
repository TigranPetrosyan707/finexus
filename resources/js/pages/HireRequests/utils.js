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

