export const filterExperts = (experts, searchQuery, filters, t) => {
  return experts.filter(expert => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = expert.name?.toLowerCase() || '';
      const profession = expert.profession?.toLowerCase() || '';
      const email = expert.email?.toLowerCase() || '';
      const matchesSearch = 
        name.includes(query) ||
        profession.includes(query) ||
        email.includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      const dailyRate = expert.dailyRate || expert.rate || 0;
      if (dailyRate < filters.minPrice || dailyRate > filters.maxPrice) return false;
    }

    if (filters.minExperience !== undefined && filters.maxExperience !== undefined) {
      const experience = expert.experienceYears || parseInt(expert.experience) || 0;
      if (filters.maxExperience === 11) {
        if (experience < filters.minExperience) return false;
      } else {
        if (experience < filters.minExperience || experience > filters.maxExperience) return false;
      }
    }

    if (filters.verifiedOnly && !expert.verified) return false;

    return true;
  });
};

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

