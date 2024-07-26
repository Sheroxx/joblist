import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "@/store/userSlice";

export const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  endpoints: (builder) => ({
    getUserLogin: builder.mutation({
      query: (credentials) => ({
        url: "/api/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Login successful, data:", data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          dispatch(setUser(data));
          window.location.href = "/";
        } catch (err) {
          console.error("Failed to login", err);
        }
      },
    }),
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Register successful, data:", data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          dispatch(setUser(data));
          window.location.href = "/";
        } catch (err) {
          console.error("Failed to register", err);
        }
      },
    }),
    fetchUserProfile: builder.query({
      query: (token) => ({
        url: "/api/profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Fetch profile successful, data:", data);
          dispatch(setUser({ user: data, accessToken: arg }));
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      },
    }),
  }),
});

export const {
  useGetUserLoginMutation,
  useRegisterUserMutation,
  useFetchUserProfileQuery,
} = authService;
