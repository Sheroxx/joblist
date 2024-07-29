"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Image from "next/image";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "24px",
    width: "90%",
    maxWidth: "500px",
    height: "auto",
    maxHeight: "80vh",
    padding: "50px",
  },
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const user = useSelector<RootState, any>((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedAccessToken && storedRefreshToken) {
        dispatch(setUser({ accessToken: storedAccessToken, refreshToken: storedRefreshToken }));
      }
    }
  }, [dispatch]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const openLoginModal = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between py-4 bg-white container mx-auto">
      <div className="flex items-center">
        <Link href={"/"}>
          <div className="text-4xl font-bold text-black">ACME</div>
        </Link>
        <div className="flex lg:hidden ml-4 space-x-2">
          <button onClick={() => changeLanguage("en")} className="px-2 py-1 border rounded bg-black text-white text-sm">
            EN
          </button>
          <button onClick={() => changeLanguage("tr")} className="px-2 py-1 border rounded bg-black text-white text-sm">
            TR
          </button>
        </div>
      </div>
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          <FaBars />
        </button>
      </div>
      <div className="hidden lg:flex items-center space-x-2">
        {accessToken ? (
          <>
            <Link href={"/job-list"}>
              <button className="px-4 py-2 font-bold text-black hover:underline">{t("header.jobList")}</button>
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 text-black hover:underline font-bold">
              {t("header.logout")}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-black">{user.email}</span>
              <Image src={user.profileImage} alt="Profile" className="w-[50px] h-[50px] rounded-full" width={100} height={100} />
            </div>
          </>
        ) : (
          <>
            <button onClick={openLoginModal} className="mr-4 px-4 py-2 border rounded text-black hover:bg-gray-200">
              {t("header.loginBtn")}
            </button>
            <button onClick={openRegisterModal} className="px-4 py-2 border rounded bg-black text-white hover:bg-gray-700">
              {t("header.registerBtn")}
            </button>
          </>
        )}
        <button onClick={() => changeLanguage("en")} className="ml-4 px-4 py-2 border rounded bg-black text-white">
          EN
        </button>
        <button onClick={() => changeLanguage("tr")} className="ml-2 px-4 py-2 border rounded bg-black text-white">
          TR
        </button>
      </div>

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-md transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
        style={{ width: "250px" }}
      >
        <button onClick={() => setMenuOpen(false)} className="text-2xl absolute top-4 right-4">
          <IoClose />
        </button>
        <div className="flex flex-col items-center mt-16 space-y-4">
          {user ? (
            <>
              <Link href={"/job-list"}>
                <button className="px-4 py-2 text-blue-500 hover:underline w-3/4">{t("header.jobList")}</button>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 text-blue-500 hover:underline w-3/4">
                {t("header.logout")}
              </button>
              <div className="flex items-center space-x-2 w-3/4 justify-center">
                <span className="text-black">{user.email}</span>
                <Image src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full" width={100} height={100} />
              </div>
            </>
          ) : (
            <>
              <button onClick={openLoginModal} className="px-4 py-2 border rounded text-black hover:bg-gray-200 w-3/4">
                {t("header.loginBtn")}
              </button>
              <button onClick={openRegisterModal} className="px-4 py-2 border rounded bg-black text-white hover:bg-gray-700 w-3/4">
                {t("header.registerBtn")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={loginModalOpen}
        onRequestClose={() => setLoginModalOpen(false)}
        contentLabel="Login Modal"
        style={customStyles}
        overlayClassName="modal-overlay"
      >
        <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 text-2xl">
          <IoClose />
        </button>
        <LoginForm />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={registerModalOpen}
        onRequestClose={() => setRegisterModalOpen(false)}
        contentLabel="Register Modal"
        style={customStyles}
        overlayClassName="modal-overlay"
      >
        <button onClick={() => setRegisterModalOpen(false)} className="absolute top-4 right-4 text-2xl">
          <IoClose />
        </button>
        <RegisterForm />
      </Modal>
    </header>
  );
};

export default Header;
