/**
 * Custom hook for ELBA survey operations
 * Provides data fetching and mutation operations for survey
 */

import { useState, useEffect, useCallback } from 'react';
import { surveyService } from '../services';
import { supabase } from '../lib/supabase';
import type { SurveyResults, UserSurveyStatus, SurveyVote } from '../types';

export const useSurvey = (userId?: string) => {
  const [results, setResults] = useState<SurveyResults>({
    thumbs_up: 0,
    thumbs_down: 0,
    total: 0,
    thumbs_up_percentage: 0,
    thumbs_down_percentage: 0,
  });
  const [userStatus, setUserStatus] = useState<UserSurveyStatus>({
    hasVoted: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setError(null);
      const data = await surveyService.getResults();
      setResults(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching survey results:', err);
    }
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!userId) {
      setUserStatus({ hasVoted: false });
      return;
    }

    try {
      setError(null);
      const status = await surveyService.getUserVoteStatus(userId);
      setUserStatus(status);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user vote status:', err);
    }
  }, [userId]);

  const submitVote = useCallback(
    async (vote: SurveyVote) => {
      if (!userId) {
        throw new Error('User must be logged in to vote');
      }

      try {
        setError(null);
        await surveyService.submitVote(userId, vote);
        // Refresh both results and user status
        await Promise.all([fetchResults(), fetchUserStatus()]);
      } catch (err) {
        setError(err as Error);
        console.error('Error submitting vote:', err);
        throw err;
      }
    },
    [userId, fetchResults, fetchUserStatus]
  );

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchResults(), fetchUserStatus()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchResults, fetchUserStatus]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = surveyService.subscribeToResults((newResults) => {
      setResults(newResults);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    results,
    userStatus,
    loading,
    error,
    submitVote,
    refetch: async () => {
      await Promise.all([fetchResults(), fetchUserStatus()]);
    },
  };
};
