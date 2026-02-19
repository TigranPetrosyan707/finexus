export const COMPANY_INFO_SCHEMA = {
  name: '',
  siret: '',
  country: '',
  address: '',
  sector: '',
};

export const USER_INFO_SCHEMA = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  role: '',
};

export const formatCompanyInfo = (user) => {
  if (!user || !user.companyInfo) {
    return {
      name: '',
      siret: '',
      country: '',
      address: '',
      sector: '',
      fiscalId: '',
    };
  }

  return {
    name: user.companyInfo.name || '',
    siret: user.companyInfo.registrationNumber || '',
    country: user.companyInfo.country || '',
    address: user.companyInfo.address || '',
    sector: user.companyInfo.sector || '',
    fiscalId: user.companyInfo.fiscalId || '',
  };
};

export const formatUserInfo = (user) => {
  if (!user) {
    return {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      role: '',
    };
  }

  if (user.role === 'company' && user.managerInfo) {
    return {
      firstname: user.managerInfo.firstname || '',
      lastname: user.managerInfo.lastname || '',
      email: user.managerInfo.email || user.email || '',
      phone: user.managerInfo.phone || '',
      role: user.managerInfo.role || '',
    };
  }

  if (user.role === 'expert' && user.personalInfo) {
    return {
      firstname: user.personalInfo.firstname || '',
      lastname: user.personalInfo.lastname || '',
      email: user.personalInfo.email || user.email || '',
      phone: user.personalInfo.phone || '',
      role: '',
    };
  }

  return {
    firstname: '',
    lastname: '',
    email: user.email || '',
    phone: '',
    role: '',
  };
};

