import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "@/store/userSlice";
import { AppDispatch } from "@/store/store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  endpoints: (builder) => ({
    getUserLogin: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          window.location.href = "/";
        } catch (err) {
          console.error("Failed to login", err);
        }
      },
    }),
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          window.location.href = "/";
        } catch (err) {
          console.error("Failed to register", err);
        }
      },
    }),
  }),
});

export const { useGetUserLoginMutation, useRegisterUserMutation } = api;
