import React, { useState } from "react";
import Modal from "react-modal";
import { useGetJobDetailQuery, useApplyJobMutation } from "@/store/services/apiService";
import LoadingSpinner from "@/components/Loading";
import { FaCheckCircle } from "react-icons/fa";
import ModalLoading from "@/components/ModalLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface JobDetailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  jobId: string;
}

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
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
  },
};

const JobDetailModal: React.FC<JobDetailModalProps> = ({ isOpen, closeModal, jobId }) => {
  const { t } = useTranslation();
  const { data: jobDetail, isLoading, error } = useGetJobDetailQuery(jobId);
  const [applyJobMutation, { isLoading: isApplying, isSuccess }] = useApplyJobMutation();
  const appliedJobIds = useSelector<RootState, string[]>(state => state.user.appliedJobs.map(v => v.id));

  const applied = appliedJobIds.findIndex((v) => v == jobId) !== -1;

  const handleApply = async () => {
    try {
      await applyJobMutation(jobId).unwrap();
      toast.success(t("success-job"));
    } catch (error) {
      toast.error(t("failed-job"));
      console.error("Failed to apply for job", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Job Detail">
      <button onClick={closeModal} className="absolute top-4 right-4 text-2xl text-black">
        ×
      </button>
      {isLoading || isApplying ? (
        <ModalLoading />
      ) : error ? (
        <p>{t("Error loading job details")}</p>
      ) : applied ? (
        <motion.div
          className="p-2 bg-white rounded-lg w-full max-w-md mx-auto text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaCheckCircle className="text-green-500 text-4xl mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-4">{t("Congratulations!")}</h2>
          <p>{t("You have successfully applied for the job.")}</p>
          <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded mt-4">
            {t("Close")}
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="p-2 bg-white rounded-lg w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">{t("Apply Job")}</h2>
          <p className="mb-2">
            <strong>{t("Company Name")}:</strong> {jobDetail?.companyName}
          </p>
          <p className="mb-2">
            <strong>{t("Job Name")}:</strong> {jobDetail?.jobName}
          </p>
          <p className="mb-2">
            <strong>{t("Created At")}:</strong> {new Date(jobDetail?.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>{t("Location")}:</strong> {jobDetail?.location}
          </p>
          <p className="mb-2">
            <strong>{t("Keywords")}:</strong> {jobDetail?.keywords?.map((keyword: string) => (
              <button key={keyword} className="bg-gray-200 px-2 py-1 rounded m-1">
                {keyword}
              </button>
            ))}
          </p>
          <p className="mb-2">
            <strong>{t("Salary")}:</strong> {jobDetail?.salary}$
          </p>
          <p className="mb-2">
            <strong>{t("Job Description")}:</strong> {jobDetail?.description}
          </p>
          <div className="flex justify-center items-center gap-4 space-x-2 mt-8">
            <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded">
              {t("Close")}
            </button>
            <button onClick={handleApply} className="bg-black text-white px-4 py-2 rounded">
              {t("Apply")}
            </button>
          </div>
        </motion.div>
      )}
    </Modal>
  );
};

export default JobDetailModal;
