export const formatExpertProfile = (expert, stats = {}) => {
  const personalInfo = expert.personalInfo || {};
  const professionalInfo = expert.professionalInfo || {};
  
  return {
    id: expert.id,
    name: `${personalInfo.firstname || ''} ${personalInfo.lastname || ''}`.trim() || expert.email,
    firstname: personalInfo.firstname || '',
    lastname: personalInfo.lastname || '',
    email: personalInfo.email || expert.email || '',
    phone: personalInfo.phone || '',
    linkedin: personalInfo.linkedin || null,
    photo: personalInfo.photo || null,
    profession: professionalInfo.profession || '',
    experience: professionalInfo.experience || '',
    experienceYears: parseInt(professionalInfo.experience) || 0,
    dailyRate: professionalInfo.dailyRate || 0,
    specialties: expert.specialties || [],
    description: expert.description || '',
    workExperience: expert.workExperience || [],
    verified: expert.verified || false,
    rating: expert.rating || 0,
    reviews: expert.reviews || 0,
    completedMissions: stats.completedMissions || 0,
  };
};

