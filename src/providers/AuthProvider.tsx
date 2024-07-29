"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import { useFetchUserProfileQuery } from "@/store/services/authService";
import LoadingSpinner from "@/components/Loading";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const { data: userProfile, isLoading } = useFetchUserProfileQuery(token, {
    skip: !token,
  });

  const login = (token: string, userData: any) => {
    localStorage?.setItem("accessToken", token);
    localStorage?.setItem("refreshToken", userData?.refreshToken);
    dispatch(setUser(userData));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearUser());
  };
  if (isLoading) {
    return <LoadingSpinner/>;
  }
  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
