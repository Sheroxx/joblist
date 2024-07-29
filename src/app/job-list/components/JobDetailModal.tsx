import React, { useState } from 'react';
import Modal from 'react-modal';
import { useGetJobDetailQuery, useApplyJobMutation } from '@/store/services/apiService';
import LoadingSpinner from '@/components/Loading';
import { FaCheckCircle } from "react-icons/fa";
import ModalLoading from '@/components/ModalLoading';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface JobDetailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  jobId: string;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '500px',
    height: 'auto',
    maxHeight: '80vh',
    padding: '50px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
  },
};

const JobDetailModal: React.FC<JobDetailModalProps> = ({ isOpen, closeModal, jobId }) => {
  const { data: jobDetail, isLoading, error } = useGetJobDetailQuery(jobId);
  const [applyJobMutation, { isLoading: isApplying, isSuccess }] = useApplyJobMutation();
  const appliedJobIds = useSelector<RootState, string[]>(state => state.user.appliedJobs.map(v => v.id));

  const applied =  appliedJobIds.findIndex((v) => v == jobId) != -1;

  const handleApply = async () => {
    try {
      await applyJobMutation(jobId).unwrap();
    } catch (error) {
      console.error("Failed to apply for job", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Job Detail"
    >
      <button onClick={closeModal} className="absolute top-4 right-4 text-2xl text-black">×</button>
      {isLoading || isApplying ? (
        <ModalLoading />
      ) : error ? (
        <p>Error loading job details</p>
      ) : applied ? (
        <div className="p-2 bg-white rounded-lg  w-full max-w-md mx-auto text-center">
          <FaCheckCircle className="text-green-500 text-4xl mb-4 mx-auto"/>
          <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
          <p>You have successfully applied for the job.</p>
          <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded mt-4">Close</button>
        </div>
      ) : (
        <div className="p-2 bg-white rounded-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Apply Job</h2>
          <p><strong>Company Name:</strong> {jobDetail?.companyName}</p>
          <p><strong>Job Name:</strong> {jobDetail?.jobName}</p>
          <p><strong>Created At:</strong> {new Date(jobDetail?.createdAt).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {jobDetail?.location}</p>
          <p><strong>Keywords:</strong> {jobDetail?.keywords?.map((keyword: string) => (
            <button key={keyword} className="bg-gray-200 px-2 py-1 rounded m-1">{keyword}</button>
          ))}</p>
          <p><strong>Salary:</strong> {jobDetail?.salary}$</p>
          <p><strong>Job Description:</strong> {jobDetail?.description}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded">Close</button>
            <button onClick={handleApply} className="bg-green-500 text-white px-4 py-2 rounded">Apply</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default JobDetailModal;
