import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../../context/AuthContext';
import { createMissionSchema } from '../validation';
import { POST_MISSION_ERRORS } from '../constants';
import toast from 'react-hot-toast';

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const usePostMission = (t) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, missionId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, userRole } = useAuth();

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

  const loadMissions = useCallback(async () => {
    try {
      setLoading(true);
      if (!user || userRole !== 'company') {
        setMissions([]);
        return;
      }
      const res = await fetch('/api/missions', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load missions');
      }
      const data = await res.json();
      setMissions(data.missions ?? []);
    } catch (error) {
      console.error('Error loading missions:', error);
      toast.error(t(POST_MISSION_ERRORS.LOAD_ERROR) || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  }, [t, user, userRole]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const onSubmit = async (formData) => {
    try {
      if (!user || userRole !== 'company') {
        toast.error(t(POST_MISSION_ERRORS.CREATE_ERROR) || 'Only companies can post missions');
        return;
      }

      const submitData = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : '',
      };

      const method = editingMission ? 'PUT' : 'POST';
      const url = editingMission ? `/api/missions/${editingMission.id}` : '/api/missions';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      if (!res.ok) {
        toast.error(
          editingMission
            ? t(POST_MISSION_ERRORS.UPDATE_ERROR) || 'Failed to update mission'
            : t(POST_MISSION_ERRORS.CREATE_ERROR) || 'Failed to create mission'
        );
        return;
      }

      if (editingMission) {
        toast.success(t('postMission.updateSuccess') || 'Mission updated successfully');
      } else {
        toast.success(t('postMission.createSuccess') || 'Mission created successfully');
      }
      await loadMissions();
      resetForm();
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
      const res = await fetch(`/api/missions/${deleteModal.missionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to delete mission');
      }
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

