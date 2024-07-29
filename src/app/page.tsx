'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl text-center font-bold mb-4 text-black"
        variants={itemVariants}
      >
        {t('HomePage.title')}
      </motion.h1>
      <motion.p
        className="text-lg text-center max-w-2xl text-gray-600"
        variants={itemVariants}
      >
        {t('HomePage.description')}
      </motion.p>
    </motion.div>
  );
};

export default HomePage;
