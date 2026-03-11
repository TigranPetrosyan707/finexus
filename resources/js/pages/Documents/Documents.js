import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaFileCsv, FaFolderOpen, FaTrash, FaEdit } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Empty from '../../components/Empty/Empty';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const Documents = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/documents', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      const data = await response.json();
      setDocuments(prev => [data.document, ...prev]);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('documents.confirmDelete'))) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
    }
  };

  const handleRename = async (id) => {
    const doc = documents.find(d => d.id === id);
    const newName = prompt(t('documents.enterNewName'), doc.name);
    
    if (!newName || !newName.trim() || newName === doc.name) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const data = await response.json();
      setDocuments(prev => prev.map(d => d.id === id ? data.document : d));
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('documents.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaFolderOpen className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('documents.subtitle')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                <FaFileCsv className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('documents.supported')}</h2>
                <p className="text-sm text-gray-600">CSV, Excel (.xlsx), FEC, PDF</p>
              </div>
            </div>
            <label
              htmlFor="fileInput"
              className={`cursor-pointer inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            >
              {isUploading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <FaUpload className="w-5 h-5" />
                  <span>{t('documents.chooseFile')}</span>
                </>
              )}
              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx,.fec,.pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : documents.length === 0 ? (
          <Empty
            icon={FaFolderOpen}
            title={t('documents.noDocuments')}
            description={t('documents.noDocumentsDescription')}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      {t('documents.name')}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      {t('documents.size')}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      {t('documents.date')}
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      {t('documents.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                            <FaFileCsv className="w-5 h-5" style={{ color: colors.linkHover }} />
                          </div>
                          <span className="font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatFileSize(doc.size)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(doc.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleRename(doc.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title={t('documents.edit')}
                          >
                            <FaEdit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title={t('documents.delete')}
                          >
                            <FaTrash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
