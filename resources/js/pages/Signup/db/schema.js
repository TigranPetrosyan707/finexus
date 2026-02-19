const processResumeFile = async (resumeFile) => {
  if (!resumeFile) return null;

  const file = resumeFile[0] || resumeFile;
  
  if (!(file instanceof File)) {
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: reader.result,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => {
      resolve({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: null,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  });
};

export const createUserSchema = async (role, formData) => {
  const baseSchema = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: formData.email,
    password: formData.password,
    role: role,
    createdAt: new Date().toISOString(),
  };

  if (role === 'company') {
    return {
      ...baseSchema,
      companyInfo: {
        name: formData.rs || '',
        sector: formData.sector || '',
        otherSector: formData.otherSector || null,
        country: formData.country || '',
        otherCountry: formData.otherCountry || null,
        registrationNumber: formData.siret || null,
      },
      managerInfo: {
        firstname: formData.firstname || '',
        lastname: formData.lastname || '',
        email: formData.email || '',
        phone: formData.phone || '',
        role: formData.role || '',
        otherRole: formData.otherRole || null,
      },
    };
  }

  if (role === 'expert') {
    const resumeData = await processResumeFile(formData.resume);
    
    return {
      ...baseSchema,
      personalInfo: {
        firstname: formData.firstname || '',
        lastname: formData.lastname || '',
        email: formData.email || '',
        phone: formData.phone || '',
        linkedin: formData.linkedin || null,
        resume: resumeData,
      },
      professionalInfo: {
        profession: formData.sector || '',
        experience: formData.experience || '',
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
      },
    };
  }

  return baseSchema;
};

