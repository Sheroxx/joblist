import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "@/store/userSlice";
import { RootState } from "../store";

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers,{getState}) => {
        const accessToken = (getState() as RootState).user.accessToken
        if (accessToken){
            headers.set('Authorization',"Bearer " + accessToken)
        } 
        return headers
    }
}),
  endpoints: (builder) => ({
    // fetchUserProfile: builder.query({
    //     query: (token) => ({
    //       url: "/api/profile",
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }),
    //     async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //       try {
    //         const { data } = await queryFulfilled;
    //         console.log("Fetch profile successful, data:", data);
    //         dispatch(setUser({ user: data, accessToken: arg }));
    //       } catch (err) {
    //         console.error("Failed to fetch profile", err);
    //       }
    //     },
    //   }),
  }),
});

export const {

} = apiService;
