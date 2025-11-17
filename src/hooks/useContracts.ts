/**
 * Custom hook for contract operations
 * Provides data fetching and mutation operations for contracts
 */

import { useState, useEffect, useCallback } from 'react';
import { contractService } from '../services';
import type { Contract, ContractFilters } from '../types';

export const useContracts = (filters?: ContractFilters) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getAll(filters);
      setContracts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
  };
};

export const useContract = (id: string | undefined) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getById(id);
      setContract(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching contract:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    contract,
    loading,
    error,
    refetch: fetchContract,
  };
};

export const useContractsByUser = (userId: string | undefined) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getByUserId(userId);
      setContracts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user contracts:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
  };
};

export const useActiveContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getActive();
      setContracts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching active contracts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
  };
};
