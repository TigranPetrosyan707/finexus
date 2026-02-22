import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaGift, FaCheckCircle } from 'react-icons/fa';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

const Trial = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError(t('trial.fillRequired'));
      return;
    }

    setSuccess(t('trial.success'));
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="fixed top-0 left-0 w-full py-4 text-center text-xl lg:text-2xl font-bold shadow-md z-50" style={{ backgroundColor: '#28c76f', color: '#fff' }}>
        {t('trial.header')}
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#28c76f20' }}>
                <FaGift className="w-8 h-8" style={{ color: '#28c76f' }} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('trial.subtitle')}
              </h1>
              <p className="text-base text-gray-600">
                {t('trial.description')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <FaCheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              )}

              <Input
                id="trial-name"
                name="firstname"
                type="text"
                placeholder={t('trial.firstname')}
                required
                value={formData.firstname}
                onChange={handleChange}
              />

              <Input
                id="trial-lastname"
                name="lastname"
                type="text"
                placeholder={t('trial.lastname')}
                required
                value={formData.lastname}
                onChange={handleChange}
              />

              <Input
                id="trial-email"
                name="email"
                type="email"
                placeholder={t('trial.email')}
                required
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                id="trial-password"
                name="password"
                type="password"
                placeholder={t('trial.password')}
                required
                value={formData.password}
                onChange={handleChange}
              />

              <Input
                id="trial-company"
                name="company"
                type="text"
                placeholder={t('trial.company')}
                value={formData.company}
                onChange={handleChange}
              />

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: '#28c76f', color: '#fff' }}
              >
                {t('trial.submit')}
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              {t('trial.hasAccount')}{' '}
              <Link
                href="/login"
                className="font-bold transition-colors hover:opacity-80"
                style={{ color: '#28c76f' }}
              >
                {t('trial.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trial;

