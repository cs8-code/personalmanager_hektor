/**
 * Survey Service
 * Handles all ELBA survey-related data operations
 */

import { supabase } from '../lib/supabase';
import type { SurveyResponse, SurveyResults, UserSurveyStatus, SurveyVote } from '../types';

export const surveyService = {
  /**
   * Get survey results (aggregated statistics)
   */
  async getResults(): Promise<SurveyResults> {
    const { data, error } = await supabase
      .from('elba_survey_responses')
      .select('vote');

    if (error) throw error;

    const responses = data as SurveyResponse[];

    const thumbs_up = responses.filter(r => r.vote === 'thumbs_up').length;
    const thumbs_down = responses.filter(r => r.vote === 'thumbs_down').length;
    const total = responses.length;

    return {
      thumbs_up,
      thumbs_down,
      total,
      thumbs_up_percentage: total > 0 ? (thumbs_up / total) * 100 : 0,
      thumbs_down_percentage: total > 0 ? (thumbs_down / total) * 100 : 0,
    };
  },

  /**
   * Check if current user has voted and get their vote
   */
  async getUserVoteStatus(userId: string): Promise<UserSurveyStatus> {
    const { data, error } = await supabase
      .from('elba_survey_responses')
      .select('vote')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return {
      hasVoted: !!data,
      vote: data?.vote as SurveyVote | undefined,
    };
  },

  /**
   * Submit or update a vote
   */
  async submitVote(userId: string, vote: SurveyVote): Promise<void> {
    // Check if user has already voted
    const { data: existing } = await supabase
      .from('elba_survey_responses')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Update existing vote
      const { error } = await supabase
        .from('elba_survey_responses')
        .update({ vote })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Insert new vote
      const { error } = await supabase
        .from('elba_survey_responses')
        .insert({ user_id: userId, vote });

      if (error) throw error;
    }
  },

  /**
   * Subscribe to survey results changes
   */
  subscribeToResults(callback: (results: SurveyResults) => void) {
    const channel = supabase
      .channel('elba_survey_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'elba_survey_responses',
        },
        async () => {
          const results = await this.getResults();
          callback(results);
        }
      )
      .subscribe();

    return channel;
  },
};
