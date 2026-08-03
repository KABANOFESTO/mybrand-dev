export interface AnalyticsEventView {
  id: string;
  name: string;
  path: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  userId: string | null;
}

export interface AnalyticsSummaryView {
  totalEvents: number;
  trackedUsers: number;
  topEvents: Array<{ name: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;
  recentEvents: AnalyticsEventView[];
}

export interface AnalyticsTrackResult {
  tracked: true;
  event: AnalyticsEventView;
}
