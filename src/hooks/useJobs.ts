/**
 * Custom hook for job operations
 * Provides data fetching and mutation operations for jobs
 */

import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services';
import type { Job, JobFilters } from '../types';

export const useJobs = (filters?: JobFilters) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getAll(filters);
      setJobs(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
  };
};

export const useJob = (id: string | undefined) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getById(id);
      setJob(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};

export const useJobsByUser = (userId: string | undefined) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getByUserId(userId);
      setJobs(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
  };
};
