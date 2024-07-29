'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterUserMutation } from '@/store/services/authService';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    email: yup.string().email(t('errors.invalidEmail')).required(t('errors.emailRequired')),
    password: yup.string().min(6, t('errors.passwordMin')).required(t('errors.passwordRequired')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), ''], t('errors.passwordsMustMatch'))
      .required(t('errors.confirmPasswordRequired')),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const onSubmit = async (data: any) => {
    try {
      await registerUser({ email: data.email, password: data.password }).unwrap();
      toast.success(t('Registration successful!'));
    } catch (err: any) {
      toast.error(t('Registration failed:') + ' ' + err.toString());
    }
  };

  return (
    <motion.div
      className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center text-black">
        {t('RegisterPage.register')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('RegisterPage.email')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="email"
              id="email"
              {...register('email')}
              className="block w-full p-2 border rounded text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('RegisterPage.email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('RegisterPage.password')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="password"
              id="password"
              {...register('password')}
              className="block w-full p-2 border rounded text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('RegisterPage.password')}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            {t('RegisterPage.confirmPassword')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className="block w-full p-2 border rounded text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('RegisterPage.confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <button type="submit" className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            {t('RegisterPage.register')}
          </button>
        </div>
      </form>
      {isLoading && <p className="mt-4 text-center text-black">{t('Loading')}</p>}
      {error && <p className="mt-4 text-center text-red-500">{t('Error')} {error.toString()}</p>}
    </motion.div>
  );
};

export default RegisterForm;
