/**
 * Survey Types
 * Type definitions for ELBA survey functionality
 */

export type SurveyVote = 'thumbs_up' | 'thumbs_down';

export interface SurveyResponse {
  id: string;
  user_id: string;
  vote: SurveyVote;
  created_at: string;
}

export interface SurveyResults {
  thumbs_up: number;
  thumbs_down: number;
  total: number;
  thumbs_up_percentage: number;
  thumbs_down_percentage: number;
}

export interface UserSurveyStatus {
  hasVoted: boolean;
  vote?: SurveyVote;
}
