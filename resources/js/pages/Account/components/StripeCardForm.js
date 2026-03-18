import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { api } from '../../../utils/api';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { colors } from '../../../constants/colors';

const PENDING_SETUP_INTENT_KEY = 'finexus_pending_setup_intent_id';

const cardElementOptions = {
  style: {
    base: {
      color: '#111827',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

function StripeCardFields({ billingName, setBillingName, onSaved, onAuthRequired }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const returnUrl = useMemo(() => {
    // Used only if Stripe requires a redirect for authentication (3DS).
    return `${window.location.origin}/account`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!stripe || !elements) {
      setErrorMessage(t('account.card.errors.stripeNotReady') || 'Stripe is not ready yet.');
      return;
    }

    setIsSaving(true);
    try {
      const { clientSecret } = await api.post('/api/account/stripe/create-setup-intent', {});
      if (!clientSecret) {
        throw new Error('Missing clientSecret from server.');
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('Card element not found.');
      }

      const confirmResult = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName,
          },
        },
        return_url: returnUrl,
      });

      if (confirmResult.error) {
        setErrorMessage(confirmResult.error.message || 'Unable to confirm the card.');
        return;
      }

      const setupIntent = confirmResult.setupIntent;
      const setupIntentId = setupIntent?.id;
      const status = setupIntent?.status;

      if (!setupIntentId) {
        throw new Error('Missing setupIntent id from Stripe response.');
      }

      if (status === 'succeeded') {
        const res = await api.post('/api/account/stripe/save-card', { setupIntentId });
        toast.success(t('account.card.savedSuccess') || 'Card saved successfully.');
        onSaved(res.paymentMethod);
      } else {
        // Stripe will usually handle the required authentication itself.
        localStorage.setItem(PENDING_SETUP_INTENT_KEY, setupIntentId);
        try {
          const res = await api.post('/api/account/stripe/save-card', { setupIntentId });
          toast.success(t('account.card.savedSuccess') || 'Card saved successfully.');
          localStorage.removeItem(PENDING_SETUP_INTENT_KEY);
          onSaved(res.paymentMethod);
        } catch (err) {
          toast.success(t('account.card.authRequired') || 'Additional authentication required. Please complete it.');
          onAuthRequired();
        }
      }
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Unable to save card.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t('account.card.cardholderName') || 'Cardholder name'}
        </label>
        <Input
          name="billingName"
          type="text"
          placeholder={t('account.card.cardholderNamePlaceholder') || 'Jean Dupont'}
          value={billingName}
          onChange={(e) => setBillingName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t('payment.cardNumber') || 'Card number'}
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <CardNumberElement
            options={cardElementOptions}
            onChange={(e) => setErrorMessage(e.error?.message || '')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('payment.expiry') || 'Expiry'}
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('payment.cvc') || 'CVC'}
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSaving || !stripe}>
        {isSaving ? (t('account.card.saving') || 'Saving...') : (t('account.card.saveCard') || 'Save card')}
      </Button>
    </form>
  );
}

const StripeCardForm = () => {
  const { t } = useTranslation();
  const [stripePromise, setStripePromise] = useState(null);
  const [publishableKeyLoading, setPublishableKeyLoading] = useState(false);

  const [savedCard, setSavedCard] = useState(null);
  const [billingName, setBillingName] = useState('');
  const [loadingCard, setLoadingCard] = useState(true);

  const refreshSavedCard = useCallback(async () => {
    const { user } = await api.get('/api/user');
    const pm = user?.stripePaymentMethod ?? null;
    setSavedCard(pm);
    setBillingName(user?.name || '');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPublishableKey = async () => {
      try {
        setPublishableKeyLoading(true);
        const { publishableKey } = await api.get('/api/account/stripe/publishable-key');
        if (!publishableKey) {
          throw new Error('Missing Stripe publishableKey.');
        }
        const sp = loadStripe(publishableKey);
        if (isMounted) setStripePromise(sp);
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Unable to initialize Stripe.');
      } finally {
        if (isMounted) setPublishableKeyLoading(false);
      }
    };

    const init = async () => {
      try {
        await refreshSavedCard();
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Unable to load saved card.');
      } finally {
        if (isMounted) setLoadingCard(false);
      }
    };

    fetchPublishableKey();
    init();

    // After a 3DS redirect, finish attaching the card using the pending SetupIntent.
    const pendingSetupIntentId = localStorage.getItem(PENDING_SETUP_INTENT_KEY);
    if (pendingSetupIntentId) {
      api
        .post('/api/account/stripe/save-card', { setupIntentId: pendingSetupIntentId })
        .then((res) => {
          toast.success(t('account.card.savedSuccess') || 'Card saved successfully.');
          localStorage.removeItem(PENDING_SETUP_INTENT_KEY);
          setSavedCard(res.paymentMethod);
        })
        .catch((err) => {
          toast.error(err?.data?.message || err?.message || 'Unable to finalize card setup.');
        })
        .finally(() => {
          // If it failed, keep the pending SetupIntent so user can try again by re-submitting.
        });
    }

    return () => {
      isMounted = false;
    };
  }, [refreshSavedCard, t]);

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('account.card.title') || 'Payment method'}</h2>
        <div className="text-sm text-gray-600" style={{ color: colors.linkHover }}>
          {savedCard?.last4 ? (
            <span>
              {savedCard.brand?.toUpperCase() || 'CARD'} •••• {savedCard.last4}
            </span>
          ) : (
            <span>{t('account.card.noCard') || 'No card saved yet'}</span>
          )}
        </div>
      </div>

      {loadingCard ? (
        <div className="text-sm text-gray-600">{t('common.loading') || 'Loading...'}</div>
      ) : (
        <>
          <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600">
            <span style={{ color: colors.linkHover }}>{t('account.card.secureSubtitle') || 'Secure card entry powered by Stripe.'}</span>
          </div>

          {stripePromise && !publishableKeyLoading ? (
            <Elements stripe={stripePromise} options={cardElementOptions}>
              <StripeCardFields
                billingName={billingName}
                setBillingName={setBillingName}
                onSaved={(pm) => {
                  setSavedCard(pm);
                }}
                onAuthRequired={() => {
                  // The redirect flow will complete and a pending SetupIntent will be handled on mount.
                }}
              />
            </Elements>
          ) : (
            <div className="text-sm text-gray-600">{t('account.card.initializing') || 'Initializing...'}</div>
          )}
        </>
      )}
    </div>
  );
};

export default StripeCardForm;

