export const formatCurrency = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

export const formatCurrencyShort = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const prepareChartData = (data, labels, labelKey, color, fillColor = null) => {
  if (!data || data.length === 0) {
    return null;
  }

  return {
    labels,
    datasets: [
      {
        label: labelKey,
        data,
        borderColor: color,
        backgroundColor: fillColor || `${color}20`,
        tension: 0.4,
        fill: !!fillColor,
      },
    ],
  };
};

export const prepareBarChartData = (data, labels, labelKey, color) => {
  if (!data || data.length === 0) {
    return null;
  }

  return {
    labels,
    datasets: [
      {
        label: labelKey,
        data,
        backgroundColor: color,
      },
    ],
  };
};

export const prepareDoughnutChartData = (data, labels, colors) => {
  if (!data || data.length === 0 || !labels || labels.length === 0) {
    return null;
  }

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
      },
    ],
  };
};

export const getChartOptions = (locale, currency = true, unit = '') => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (currency) {
              return value.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR') + ' €';
            }
            return value + unit;
          },
        },
      },
    },
  };
};

export const getDoughnutChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
};

