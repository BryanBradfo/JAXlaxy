export type Status = "🟢" | "🟡" | "🔴";
export type Suggested = Status | "?";

export interface Star {
  user: string;
  repo: string;
  url: string;
  section: string;
  description: string;
  status: Status;
  suggested: Suggested;
  stars: number | null;
  last_push_months_ago: number | null;
  archived: boolean;
  flag: string;
}

export interface Galaxy {
  generated_at: string;
  total: number;
  thresholds: { stale_months: number; abandoned_months: number };
  stars: Star[];
}
