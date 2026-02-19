import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FaCheck, FaStar, FaRocket, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import Payment from '../Payment/Payment';

const Subscription = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: t('subscription.plans.free.name'),
      price: '0',
      period: t('subscription.plans.free.period'),
      features: [
        t('subscription.plans.free.features.visibility'),
        t('subscription.plans.free.features.basic'),
      ],
      icon: FaStar,
      color: '#9ca3af',
    },
    {
      id: 'basic',
      name: t('subscription.plans.basic.name'),
      price: '29',
      period: t('subscription.plans.basic.period'),
      features: [
        t('subscription.plans.basic.features.visibility'),
        t('subscription.plans.basic.features.page'),
        t('subscription.plans.basic.features.space'),
      ],
      icon: FaRocket,
      color: colors.linkHover,
    },
    {
      id: 'pro',
      name: t('subscription.plans.pro.name'),
      price: '59',
      period: t('subscription.plans.pro.period'),
      features: [
        t('subscription.plans.pro.features.tracking'),
        t('subscription.plans.pro.features.assessment'),
        t('subscription.plans.pro.features.proposals'),
        t('subscription.plans.pro.features.marketplace'),
      ],
      icon: FaCrown,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('subscription.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subscription.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all flex flex-col ${
                  isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${plan.color}20` }}>
                    <IconComponent className="w-8 h-8" style={{ color: plan.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FaCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setSelectedPlan(plan.id)}
                  className="w-full mt-auto"
                  variant={isSelected ? 'default' : 'secondary'}
                  style={isSelected ? { backgroundColor: plan.color, color: '#fff' } : { borderColor: plan.color, borderWidth: '2px', borderStyle: 'solid' }}
                >
                  {isSelected ? t('subscription.select') : t('subscription.choose')}
                </Button>
              </div>
            );
          })}
        </div>

        {selectedPlan && (
          <div className="max-w-2xl mx-auto">
            {selectedPlan === 'free' ? (
              <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${colors.buttonBackground}20` }}>
                    <FaCheckCircle className="w-8 h-8" style={{ color: colors.buttonBackground }} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {t('subscription.freeActivation.title')}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {t('subscription.freeActivation.message')}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast.success(t('subscription.freeActivation.success'));
                    setSelectedPlan(null);
                  }}
                >
                  {t('subscription.freeActivation.activate')}
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200">
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {t('payment.selectedPlan')}: {plans.find(p => p.id === selectedPlan)?.name}
                  </h2>
                  <p className="text-xl font-bold" style={{ color: colors.linkHover }}>
                    {plans.find(p => p.id === selectedPlan)?.price}€/{plans.find(p => p.id === selectedPlan)?.period}
                  </p>
                </div>
                <Payment 
                  plan={{
                    name: plans.find(p => p.id === selectedPlan)?.name,
                    price: `${plans.find(p => p.id === selectedPlan)?.price}€/${plans.find(p => p.id === selectedPlan)?.period}`
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;

