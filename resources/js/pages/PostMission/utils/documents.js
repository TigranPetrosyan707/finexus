export const getDocuments = () => {
  try {
    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      return JSON.parse(savedDocuments);
    }
    return [];
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
};

export const getDocumentOptions = (t) => {
  const documents = getDocuments();
  return documents.map((doc, index) => ({
    value: doc.id || `doc-${index}`,
    label: doc.name || doc.filename || `Document ${index + 1}`
  }));
};

