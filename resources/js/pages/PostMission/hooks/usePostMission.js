import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { missionsDB } from '../db';
import { db } from '../../../utils/database';
import { createMissionSchema } from '../validation';
import { POST_MISSION_ERRORS } from '../constants';
import toast from 'react-hot-toast';

export const usePostMission = (t) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, missionId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(createMissionSchema(t)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      minBudget: 0,
      maxBudget: 1000,
      durationDays: '',
      location: '',
      section: '',
      startDate: null,
      requirements: [],
      documents: [],
    },
  });

  const loadCurrentUser = async () => {
    try {
      const user = await db.get('currentUser');
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadMissions = useCallback(async () => {
    try {
      setLoading(true);
      const user = await db.get('currentUser');
      if (user && user.role === 'company') {
        const companyMissions = await missionsDB.getMissionsByCompanyId(user.id);
        setMissions(companyMissions);
      } else {
        setMissions([]);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
      toast.error(t(POST_MISSION_ERRORS.LOAD_ERROR) || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCurrentUser();
    loadMissions();
  }, [loadMissions]);

  const onSubmit = async (formData) => {
    try {
      const user = await db.get('currentUser');
      if (!user || user.role !== 'company') {
        toast.error(t(POST_MISSION_ERRORS.CREATE_ERROR) || 'Only companies can post missions');
        return;
      }

      const submitData = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : '',
      };

      if (editingMission) {
        const updated = await missionsDB.updateMission(editingMission.id, submitData);
        if (updated) {
          toast.success(t('postMission.updateSuccess') || 'Mission updated successfully');
          await loadMissions();
          resetForm();
        } else {
          toast.error(t(POST_MISSION_ERRORS.UPDATE_ERROR) || 'Failed to update mission');
        }
      } else {
        const newMission = await missionsDB.createMission(submitData, user.id);
        if (newMission) {
          toast.success(t('postMission.createSuccess') || 'Mission created successfully');
          await loadMissions();
          resetForm();
        } else {
          toast.error(t(POST_MISSION_ERRORS.CREATE_ERROR) || 'Failed to create mission');
        }
      }
    } catch (error) {
      console.error('Error submitting mission:', error);
      toast.error(
        editingMission
          ? t(POST_MISSION_ERRORS.UPDATE_ERROR) || 'Failed to update mission'
          : t(POST_MISSION_ERRORS.CREATE_ERROR) || 'Failed to create mission'
      );
    }
  };

  const resetForm = () => {
    reset({
      title: '',
      description: '',
      minBudget: 0,
      maxBudget: 1000,
      durationDays: '',
      location: '',
      section: '',
      otherSection: '',
      startDate: null,
      requirements: [],
      documents: [],
    });
    setShowForm(false);
    setEditingMission(null);
  };

  const handleEdit = (mission) => {
    reset({
      title: mission.title,
      description: mission.description,
      minBudget: mission.minBudget !== undefined ? mission.minBudget : (mission.budget || 0),
      maxBudget: mission.maxBudget !== undefined ? mission.maxBudget : (mission.budget || 1000),
      durationDays: mission.durationDays.toString(),
      location: mission.location,
      section: mission.section && !['Commerce', 'Industrie', 'Services', 'Finance'].includes(mission.section) ? 'Autre' : (mission.section || ''),
      otherSection: mission.section && !['Commerce', 'Industrie', 'Services', 'Finance'].includes(mission.section) ? mission.section : '',
      startDate: mission.startDate ? new Date(mission.startDate) : null,
      requirements: mission.requirements || [],
      documents: mission.documents || [],
    });
    setEditingMission(mission);
    setShowForm(true);
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, missionId: id });
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, missionId: null });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.missionId) return;

    setIsDeleting(true);
    try {
      await missionsDB.deleteMission(deleteModal.missionId);
      toast.success(t('postMission.deleteSuccess') || 'Mission deleted successfully');
      await loadMissions();
      setDeleteModal({ isOpen: false, missionId: null });
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error(t(POST_MISSION_ERRORS.DELETE_ERROR) || 'Failed to delete mission');
    } finally {
      setIsDeleting(false);
    }
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  return {
    loading,
    missions,
    showForm,
    editingMission,
    currentUser,
    register,
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    onSubmit,
    resetForm,
    handleEdit,
    handleDelete: openDeleteModal,
    deleteModal,
    closeDeleteModal,
    confirmDelete: handleDelete,
    isDeleting,
    openForm,
  };
};

