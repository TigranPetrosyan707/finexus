export const formatExpertData = (expert) => {
  const personalInfo = expert.personalInfo || {};
  const professionalInfo = expert.professionalInfo || {};
  
  return {
    id: expert.id,
    name: `${personalInfo.firstname || ''} ${personalInfo.lastname || ''}`.trim(),
    firstname: personalInfo.firstname || '',
    lastname: personalInfo.lastname || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    linkedin: personalInfo.linkedin || null,
    profession: professionalInfo.profession || '',
    experience: professionalInfo.experience || '0',
    experienceYears: parseInt(professionalInfo.experience) || 0,
    dailyRate: professionalInfo.dailyRate || 0,
    rate: professionalInfo.dailyRate || 0,
    rating: expert.rating || 0,
    reviews: expert.reviews || 0,
    verified: expert.verified || false,
    specialties: expert.specialties || [],
    resume: personalInfo.resume || null,
    createdAt: expert.createdAt,
  };
};

