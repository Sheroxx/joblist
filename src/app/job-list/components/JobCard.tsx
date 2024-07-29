import React, { useState } from "react";
import { FaBriefcase, FaCheckCircle } from "react-icons/fa";
import JobDetailModal from "./JobDetailModal";
import LoadingSpinner from "@/components/Loading";
import ModalLoading from "@/components/ModalLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface Job {
  id: string;
  name:string;
  companyName: string;
  jobName: string;
  description: string;
  location: string;
  salary: string;
  keywords?: string[];
}

interface JobCardProps {
  job: Job;
  withdrawJob: (id: string) => any;
}

const JobCard: React.FC<JobCardProps> = ({ job, withdrawJob }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const appliedJobIds = useSelector<RootState, string[]>(state => state.user.appliedJobs.map(v => v.id));

  const isApplied = appliedJobIds.findIndex((v) => v == job.id) !== -1;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await withdrawJob(job.id).unwrap();
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      toast.success(t("success-withdraw"));
    } catch (error) {
      console.error("Failed to withdraw job", error);
      setLoading(false);
      toast.error(t("error-withdraw"));
    }
  };

  return (
    <motion.div
      className="border p-4 rounded-md mb-4 shadow-sm bg-white flex flex-col md:flex-row md:items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-shrink-0 flex items-start md:items-center mb-4 md:mb-0 md:mr-4">
        <FaBriefcase className="text-5xl text-gray-600" />
      </div>
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
          <div className="text-lg font-bold">
            {job.companyName} - {job.name}
          </div>
        </div>
        <div className="text-sm text-gray-600">{job.description}</div>
        <div className="mt-2">
          <p className="block">
            <span className="font-bold">{t("Location")}: </span>
            {job.location}
          </p>
          <p className="block">
            <span className="font-bold">{t("Salary")}:</span> {job.salary}$
          </p>
        </div>
        <div className="mt-2 space-x-2">
          {job.keywords &&
            job.keywords.map((keywords) => (
              <button key={keywords} className="bg-gray-200 px-2 py-1 rounded">
                {keywords}
              </button>
            ))}
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-2 md:mt-0 md:ml-4">
        <button onClick={openModal} className="bg-black text-white px-4 py-2 rounded">
          {t("Detail")}
        </button>
        {isApplied ? (
          <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-2 rounded">
            {loading ? <p>{t("Kaldırlıyor...")}</p> : t("Withdraw")}
          </button>
        ) : null}
      </div>
      <JobDetailModal isOpen={isModalOpen} closeModal={closeModal} jobId={job.id} />
    </motion.div>
  );
};

export default JobCard;
