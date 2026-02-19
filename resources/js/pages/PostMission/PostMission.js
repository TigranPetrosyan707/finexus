import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { MdWorkHistory } from 'react-icons/md';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { usePostMission } from './hooks/usePostMission';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';

const PostMission = () => {
  const { t, i18n } = useTranslation();
  const {
    missions,
    showForm,
    editingMission,
    register,
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    onSubmit,
    resetForm,
    handleEdit,
    handleDelete,
    deleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
    openForm,
  } = usePostMission(t);

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('postMission.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <MdWorkHistory className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('postMission.subtitle')}
            </p>
          </div>
          <Button
            onClick={openForm}
            className="flex items-center space-x-2"
            style={{ backgroundColor: colors.linkHover, color: '#fff' }}
          >
            <FaPlus className="w-5 h-5" />
            <span>{t('postMission.createNew')}</span>
          </Button>
        </div>

        {showForm && (
          <MissionForm
            register={register}
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onCancel={resetForm}
            isEditing={!!editingMission}
            watch={watch}
            setValue={setValue}
            t={t}
          />
        )}

        <MissionList
          missions={missions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          t={t}
          locale={i18n.language}
        />

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title={t('postMission.deleteConfirmTitle') || 'Delete Mission'}
          message={t('postMission.deleteConfirm') || 'Are you sure you want to delete this mission? This action cannot be undone.'}
          confirmText={t('postMission.delete') || 'Delete'}
          cancelText={t('postMission.cancel') || 'Cancel'}
          variant="danger"
          icon={FaTrash}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default PostMission;
