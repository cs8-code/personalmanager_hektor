/**
 * Custom hook for contact request operations
 * Provides data fetching and mutation operations for contact requests
 */

import { useState, useEffect, useCallback } from 'react';
import { contactRequestService } from '../services';
import type { ContactRequest } from '../types';

export const useContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactRequestService.getAll();
      setRequests(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching contact requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
  };
};

export const useContactRequest = (id: string | undefined) => {
  const [request, setRequest] = useState<ContactRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await contactRequestService.getById(id);
      setRequest(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching contact request:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return {
    request,
    loading,
    error,
    refetch: fetchRequest,
  };
};

export const useContactRequestsByWorker = (workerId: string | undefined) => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await contactRequestService.getByWorkerId(workerId);
      setRequests(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching worker contact requests:', err);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
  };
};

export const usePendingRequestsCount = (workerId: string | undefined) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await contactRequestService.getPendingCount(workerId);
      setCount(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching pending requests count:', err);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    error,
    refetch: fetchCount,
  };
};
