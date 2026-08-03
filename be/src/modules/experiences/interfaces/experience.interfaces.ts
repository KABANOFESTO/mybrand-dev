export interface ExperienceView {
  id: string;
  company: string;
  role: string;
  location: string | null;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceDeleteResult {
  deleted: boolean;
}
