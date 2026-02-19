export const MISSION_SCHEMA = {
  id: '',
  companyId: '',
  title: '',
  description: '',
  minBudget: 0,
  maxBudget: 0,
  durationDays: 0,
  location: '',
  section: '',
  otherSection: '',
  requirements: [],
  documents: [],
  startDate: '',
  postedDate: '',
  applications: 0,
  status: 'active',
  createdAt: '',
  updatedAt: '',
};

export const createMissionSchema = (formData, companyId) => {
  const minBudget = typeof formData.minBudget === 'number' ? formData.minBudget : parseFloat(formData.minBudget) || 0;
  const maxBudget = typeof formData.maxBudget === 'number' ? formData.maxBudget : parseFloat(formData.maxBudget) || 0;
  
  return {
    id: formData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    companyId: companyId,
    title: formData.title || '',
    description: formData.description || '',
    minBudget: minBudget,
    maxBudget: maxBudget,
    durationDays: typeof formData.durationDays === 'number' ? formData.durationDays : parseInt(formData.durationDays) || 0,
    location: formData.location || '',
    section: formData.section === 'Autre' ? (formData.otherSection || '') : (formData.section || ''),
    otherSection: formData.otherSection || '',
    requirements: Array.isArray(formData.requirements) ? formData.requirements : [],
    documents: Array.isArray(formData.documents) ? formData.documents : [],
    startDate: formData.startDate || '',
    postedDate: formData.postedDate || new Date().toISOString().split('T')[0],
    applications: formData.applications || 0,
    status: formData.status || 'active',
    createdAt: formData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

