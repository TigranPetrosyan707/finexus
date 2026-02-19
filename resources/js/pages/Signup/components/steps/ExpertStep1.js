import React, { useState, useEffect } from 'react';
import { FaUpload, FaFilePdf, FaImage } from 'react-icons/fa';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import { colors } from '../../../../constants/colors';

const ExpertStep1 = ({ register, errors, watchedResume, t, watch }) => {
  const watchedPhoto = watch('photo');
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (watchedPhoto && watchedPhoto.length > 0) {
      const file = watchedPhoto[0] || watchedPhoto;
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('signup.expert.step1')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.photo')}
          </label>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                  <FaImage className="w-6 h-6" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('signup.expert.photo')}
                  </h3>
                  <p className="text-sm text-gray-600">JPG, PNG, GIF</p>
                  {photoPreview ? (
                    <div className="mt-2">
                      <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    </div>
                  ) : watchedPhoto && watchedPhoto.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('signup.expert.photoSelected')}: {watchedPhoto[0]?.name || watchedPhoto.name}
                    </p>
                  )}
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  {...register('photo')}
                  id="photo"
                  name="photo"
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  className="flex items-center space-x-2"
                  style={{ backgroundColor: colors.linkHover, color: '#fff' }}
                  onClick={() => document.getElementById('photo').click()}
                >
                  <FaUpload className="w-5 h-5" />
                  <span>{t('signup.expert.choosePhoto')}</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.firstname')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('firstname')}
            id="firstname"
            name="firstname"
            type="text"
            placeholder={t('signup.firstname')}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.lastname')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('lastname')}
            id="lastname"
            name="lastname"
            type="text"
            placeholder={t('signup.lastname')}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.email')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            id="email"
            name="email"
            type="email"
            placeholder={t('signup.email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.phone')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('phone')}
            id="phone"
            name="phone"
            type="tel"
            placeholder={t('signup.phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.linkedin')}
          </label>
          <Input
            {...register('linkedin')}
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder={t('signup.expert.linkedin')}
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.resume')}
          </label>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                  <FaFilePdf className="w-6 h-6" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('signup.expert.resume')}
                  </h3>
                  <p className="text-sm text-gray-600">PDF, DOC, DOCX</p>
                  {watchedResume && watchedResume.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('signup.expert.resumeSelected')}: {watchedResume[0]?.name || watchedResume.name}
                    </p>
                  )}
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  {...register('resume')}
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <Button
                  type="button"
                  className="flex items-center space-x-2"
                  style={{ backgroundColor: colors.linkHover, color: '#fff' }}
                  onClick={() => document.getElementById('resume').click()}
                >
                  <FaUpload className="w-5 h-5" />
                  <span>{t('signup.expert.chooseFile')}</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertStep1;

