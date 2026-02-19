import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaFileCsv, FaFolderOpen } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import Empty from '../../components/Empty/Empty';

const Documents = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const loadDocuments = async () => {
      const savedDocuments = localStorage.getItem('documents');
      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      }
    };
    loadDocuments();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    alert(t('documents.uploadDisabled'));
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
            <label className="cursor-pointer">
              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx,.fec,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                className="flex items-center space-x-2"
                style={{ backgroundColor: colors.linkHover, color: '#fff' }}
              >
                <FaUpload className="w-5 h-5" />
                <span>{t('documents.chooseFile')}</span>
              </Button>
            </label>
          </div>
        </div>

        {documents.length === 0 && (
          <Empty
            icon={FaFolderOpen}
            title={t('documents.noDocuments')}
            description={t('documents.noDocumentsDescription')}
          />
        )}
      </div>
    </div>
  );
};

export default Documents;

