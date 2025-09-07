export interface DashboardOverview {
  total_submissions: number;
  pending_review: number;
  avg_score: number | null;
  high_risk_count: number;
  unresolved_contacts: number;
  submissions_today: number;
}

export interface AdminAnalytics {
  submissions: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    today: number;
    avg_score: number | null;
  };
  workload: {
    pending_review: number;
    contacts_needing_response: number;
    low_score_approved: number;
  };
  quality: {
    score_avg_last_30_days: number | null;
    risk_distribution: { [key: string]: number };
    rejection_rate_percent: number;
  };
  contacts: {
    total: number;
    new: number;
    in_progress: number;
    resolved: number;
    today: number;
  };
  questions: {
    total_questions: number;
    avg_answers_per_submission: number;
  };
  activity_trend: Array<{
    activity_date: string;
    submissions: number;
    contacts: number;
  }>;
  score_distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  recent_activity: {
    recent_high_risk: Array<Record<string, any>>;
    recent_contacts: Array<Record<string, any>>;
    recent_pending: Array<Record<string, any>>;
  };
}
