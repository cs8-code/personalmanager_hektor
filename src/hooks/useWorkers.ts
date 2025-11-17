/**
 * Custom hook for worker operations
 * Provides data fetching and mutation operations for workers
 */

import { useState, useEffect, useCallback } from 'react';
import { workerService } from '../services';
import type { Worker, WorkerFilters } from '../types';

export const useWorkers = (filters?: WorkerFilters) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workerService.getAll(filters);
      setWorkers(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  return {
    workers,
    loading,
    error,
    refetch: fetchWorkers,
  };
};

export const useWorker = (id: string | undefined) => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorker = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await workerService.getById(id);
      setWorker(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching worker:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorker();
  }, [fetchWorker]);

  return {
    worker,
    loading,
    error,
    refetch: fetchWorker,
  };
};

export const useWorkersByCreator = (creatorId: string | undefined) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkers = useCallback(async () => {
    if (!creatorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await workerService.getByCreatorId(creatorId);
      setWorkers(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching creator workers:', err);
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  return {
    workers,
    loading,
    error,
    refetch: fetchWorkers,
  };
};
