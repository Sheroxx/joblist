import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppliedJob {
  id: string;
  companyName: string;
  location: string;
}

interface UserState {
  user: {
    id: string;
    email: string;
    profileImage: string;
    appliedJobs: string[];
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  appliedJobs: AppliedJob[];
}

const initialState: UserState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  appliedJobs: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload?.user;
      state.accessToken = action.payload?.accessToken;
      state.refreshToken = action.payload?.refreshToken;
    },
    setApplyJobs(state, action: PayloadAction<AppliedJob[]>) {
      state.appliedJobs = action.payload;
    },
    addApplyJob(state, action: PayloadAction<AppliedJob>) {
      const index = state.appliedJobs.findIndex((v) => v.id == action.payload.id);
      if(index == -1) {
        state.appliedJobs.unshift(action.payload);  
      }
      
    },
    removeApplyJob(state, action: PayloadAction<string>) {
      state.appliedJobs = state.appliedJobs.filter((v) => v.id != action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    }
  },
});

export const { setUser, clearUser, setApplyJobs, addApplyJob, removeApplyJob } = userSlice.actions;
export default userSlice.reducer;
