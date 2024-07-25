"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("");

  return (
    <footer className="bg-white p-8 shadow-inner">
      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto items-start lg:items-end">
        <div className="md:flex space-around md:items-start items-center gap-5">
          <h2 className="text-4xl font-bold sm:text-left text-center text-black">{t("Footer.title")}</h2>
          <div>
            <p className="font-semibold text-black sm:text-left text-center">{t("Footer.getStarted")}</p>
            <p className="text-gray-700 max-w-md sm:text-left text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
        <div className="hidden lg:block border-l-2 border-gray-300 h-full mx-auto"></div>
        <div className="text-gray-500 text-sm md:text-start lg:text-left sm:text-left text-center lg:flex lg:flex-col lg:justify-start lg:items-start">
          {t("Footer.privacyTerms")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
