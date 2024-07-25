'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl text-center font-bold mb-4 text-black">{t('HomePage.title')}</h1>
      <p className="text-lg text-center max-w-2xl text-gray-600">
        {t('HomePage.description')}
      </p>
    </div>
  );
};

export default HomePage;
