'use client';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useWithdrawJobMutation } from "@/store/services/apiService";
import LoadingSpinner from "@/components/Loading";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { setApplyJobs } from "@/store/userSlice";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const { t } = useTranslation();
  const [withdrawJob] = useWithdrawJobMutation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const user = useSelector((state: RootState) => state.user.user) as any;
  const appliedJobs = useSelector((state: RootState) => state.user.appliedJobs) as any[];

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = useSelector((state: RootState) => state.user.accessToken) as string;

  useEffect(() => {
    if (user?.appliedJobs) {
      getDatas();
    }
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

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="text-center mb-4">
        {typeof window !== "undefined" && user?.profileImage && (
          <Image src={user?.profileImage} alt="Profile" className="rounded-full w-20 h-20 mx-auto" width={100} height={100} />
        )}
        <div className="mt-2">{user?.email}</div>
      </div>
      <div className="text-lg font-bold mb-4 text-center">{t("Applied Jobs")}</div>
      <motion.div className="space-y-6 max-h-[70%] overflow-y-auto" variants={containerVariants} initial="hidden" animate="visible">
        {loading && <LoadingSpinner />}
        {appliedJobs.map((job: Job) => (
          <motion.div key={job.id} className="border p-4 rounded-md shadow-sm bg-white" variants={itemVariants}>
            <h3 className="text-center text-lg text-ellipsis font-bold mb-3">{job.name}</h3>
            <p className="text-left mb-3">
              <strong>{t("Company Name")}:</strong> {job.companyName}
            </p>
            <p className="text-left mb-3">
              <strong>{t("Location")}:</strong> {job.location}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default AppliedList;
