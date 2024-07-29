'use client';
import React, { useEffect, useState } from 'react';
import { useLazyGetJobsListQuery, useWithdrawJobMutation } from '@/store/services/apiService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import JobCard from './components/JobCard';
import LoadingSpinner from '@/components/Loading';
import AppliedList from './components/AppliedList';
import { useTranslation } from 'react-i18next';

interface Job {
  id: string;
  companyName: string;
  jobName: string;
  description: string;
  location: string;
  salary: string;
  tags: string[];
}

interface User {
  id: string;
  email: string;
  profileImage: string;
}

const JobsList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchField, setSearchField] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderByField, setOrderByField] = useState('createdAt');
  const [orderByDirection, setOrderByDirection] = useState('asc');
  const [getJobsList, { data, isLoading, error }] = useLazyGetJobsListQuery();
  const [withdrawJob] = useWithdrawJobMutation();
  const user = useSelector((state: RootState) => state.user.user) as User | null;

  useEffect(() => {
    getJobsList({ page, perPage, searchField, searchQuery, orderByField, orderByDirection });
  }, [page, perPage, searchField, searchQuery, orderByField, orderByDirection, getJobsList]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>{t('Error loading jobs')}</p>;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-3/4 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-start mb-4 gap-8">
        
          <div className="flex flex-col md:flex-row md:space-x-2">
            <p className='text-center flex justify-center items-center me-4'>{t('Basic Filter')}</p>
            <select
              className="border px-4 py-2 rounded mb-2 md:mb-0"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="">{t('Select a Field')}</option>
              <option value="name">{t('Job Name')}</option>
              <option value="companyName">{t('Company Name')}</option>
              <option value="location">{t('Location')}</option>
            </select>
            <input
              type="text"
              className="border px-4 py-2 rounded"
              placeholder={t('Search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {data?.data?.map((job: Job) => (
          <JobCard key={job.id} job={job} withdrawJob={withdrawJob} />
        ))}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setPage(page => Math.max(page - 1, 1))}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {t('Previous')}
          </button>
          <div>{page}/{Math.ceil(data?.meta?.total / perPage)}</div>
          <button
            onClick={() => setPage(page => page + 1)}
            className="bg-black text-white px-6 py-2 rounded"
          >
            {t('Next')}
          </button>
        </div>
      </div>
      <div className="md:w-1/4 p-4 border-t md:border-t-0 md:border-l">
        <AppliedList />
      </div>
    </div>
  );
};

export default JobsList;
