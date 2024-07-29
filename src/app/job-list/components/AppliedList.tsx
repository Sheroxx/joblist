import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useWithdrawJobMutation } from "@/store/services/apiService";
import LoadingSpinner from "@/components/Loading";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { setApplyJobs } from "@/store/userSlice";

interface Job {
  id: string;
  companyName: string;
  name: string;
  description: string;
  location: string;
  salary: string;
  keywords?: string[];
}

const AppliedList: React.FC = () => {
  const [withdrawJob] = useWithdrawJobMutation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const user = useSelector((state: RootState) => state.user.user) as any;
  const appliedJobs = useSelector((state: RootState) => state.user.appliedJobs) as any[];
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = useSelector(
    (state: RootState) => state.user.accessToken
  ) as string;

  useEffect(() => {
    getDatas();
  }, [user?.appliedJobs]);

  const getDatas = async () => {
    try {
      const jobDetails = await Promise.all(
        user?.appliedJobs.map(async (id: string) => {
          const response = await axios.get<Job>(`${baseUrl}api/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        })
      );

      dispatch(setApplyJobs(jobDetails.reverse()));
     
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <img
          src={user?.profileImage}
          alt="Profile"
          className="rounded-full w-20 h-20 mx-auto"
        />
        <div className="mt-2">{user?.email}</div>
      </div>
      <div className="text-lg font-bold mb-4 text-center">Applied Jobs</div>
      <div className="space-y-6 max-h-[%70] overflow-y-auto">
        {loading && <LoadingSpinner />}

        {appliedJobs.map((job: Job) => (
          <div key={job.id} className="border p-4 rounded-md shadow-sm bg-white">
            <h3 className="text-center text-lg text-ellipsis font-bold mb-3">
              {job.name}
            </h3>
            <p className="text-left mb-3">
              <strong>Company Name:</strong> {job.companyName}
            </p>
            <p className="text-left mb-3">
              <strong>Location:</strong> {job.location}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AppliedList;
