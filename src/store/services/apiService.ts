import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addApplyJob, removeApplyJob } from "@/store/userSlice";
import { RootState } from "../store";

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).user.accessToken;
      if (accessToken) {
        headers.set("Authorization", "Bearer " + accessToken);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getJobsList: builder.query({
      query: ({
        page,
        perPage,
        orderByField,
        orderByDirection,
        searchField,
        searchQuery,
      }) => {
        const params: any = {
          page,
          perPage,
          ['orderBy[field]']: orderByField,
          ['orderBy[direction]']: orderByDirection,
        };

        if(searchQuery != "" && searchField != "") {
          params['search[field]'] = searchField
          params['search[query]'] = searchQuery
        }

        return {
          url: "api/jobs",
          params
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err) {
          console.error("Failed to fetch jobs", err);
        }
      },
    }),
    withdrawJob: builder.mutation({
      query: (id) => ({
        url: `/api/jobs/${id}/withdraw`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(removeApplyJob(arg));
        } catch (err) {
          console.error("Failed to withdraw job", err);
        }
      },
    }),
    getJobDetail: builder.query({
      query: (id) => ({
        url: `/api/jobs/${id}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (err) {
          console.error("Failed to fetch job detail", err);
        }
      },
    }),
    applyJob: builder.mutation({
      query: (id) => ({
        url: `/api/jobs/${id}/apply`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: applyData } = await queryFulfilled;
          const state = getState() as RootState;
          const data: any = state.api.queries['getJobDetail("' + arg + '")']?.data;
          const { companyName, location } = data;

          dispatch(addApplyJob({ id: arg, companyName, location }));
        } catch (err) {
          console.error("Failed to apply job", err);
        }
      },
    }),
  }),
});

export const {
  useLazyGetJobsListQuery,
  useWithdrawJobMutation,
  useGetJobDetailQuery,
  useApplyJobMutation,
} = apiService;
