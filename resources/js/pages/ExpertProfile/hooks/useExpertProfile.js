import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { expertProfileDB } from '../db';
import { formatExpertProfile } from '../db/schema';
import { createExpertProfileSchema } from '../validation';
import toast from 'react-hot-toast';

export const useExpertProfile = (t) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(createExpertProfileSchema(t)),
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const expert = await expertProfileDB.getCurrentExpert();
        
        if (!expert) {
          toast.error(t('expertProfile.loadError') || 'Failed to load profile');
          return;
        }

        const stats = await expertProfileDB.getExpertStats(expert.id);
        const formattedProfile = formatExpertProfile(expert, stats);
        setProfile(formattedProfile);
        
        reset({
          firstname: formattedProfile.firstname,
          lastname: formattedProfile.lastname,
          email: formattedProfile.email,
          phone: formattedProfile.phone,
          linkedin: formattedProfile.linkedin || '',
          profession: formattedProfile.profession,
          experience: formattedProfile.experience,
          dailyRate: formattedProfile.dailyRate,
          description: formattedProfile.description || '',
          specialties: formattedProfile.specialties || [],
        });
      } catch (error) {
        console.error('Error loading expert profile:', error);
        toast.error(t('expertProfile.loadError') || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [t, reset]);

  const onSubmit = async (formData) => {
    try {
      setIsUpdating(true);
      const expert = await expertProfileDB.getCurrentExpert();
      
      if (!expert) {
        toast.error(t('expertProfile.updateError') || 'Failed to update profile');
        return;
      }

      const updated = await expertProfileDB.updateExpertProfile(expert.id, formData);
      
      if (updated) {
        const stats = await expertProfileDB.getExpertStats(updated.id);
        const formattedProfile = formatExpertProfile(updated, stats);
        setProfile(formattedProfile);
        setIsEditing(false);
        toast.success(t('expertProfile.updateSuccess') || 'Profile updated successfully');
      } else {
        toast.error(t('expertProfile.updateError') || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error(t('expertProfile.updateError') || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      reset({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin || '',
        profession: profile.profession,
        experience: profile.experience,
        dailyRate: profile.dailyRate,
        description: profile.description || '',
        specialties: profile.specialties || [],
      });
    }
  };

  return {
    loading,
    profile,
    isEditing,
    isUpdating,
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    handleEdit,
    handleCancel,
  };
};

