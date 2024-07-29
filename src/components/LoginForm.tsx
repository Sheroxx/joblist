"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useGetUserLoginMutation } from "@/store/services/authService";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

const LoginForm = () => {
  const { t } = useTranslation();
  const { login }: any = useAuth();

  const schema = yup.object().shape({
    email: yup.string().required(t("errors.usernameRequired")),
    password: yup.string().required(t("errors.passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [getUserLogin, { isLoading, error }] = useGetUserLoginMutation();

  const onSubmit = async (data: any) => {
    try {
      const response = await getUserLogin(data).unwrap();
      login(response.accessToken, response);
    } catch (err) {
      console.error("Failed to login", err);
    }
  };

  return (
    <motion.div
      className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center text-black">
        {t("LoginPage.login")}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {t("LoginPage.email")}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="email"
              {...register("email")}
              className="block w-full p-2 border text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("LoginPage.email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t("LoginPage.password")}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="password"
              id="password"
              {...register("password")}
              className="block w-full p-2 border text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("LoginPage.password")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {t("LoginPage.login")}
          </button>
        </div>
      </form>
      {isLoading && (
        <p className="mt-4 text-center text-blue-500">{t("Loading")}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-red-500">
          {t("Error")} {error.toString()}
        </p>
      )}
    </motion.div>
  );
};

export default LoginForm;
