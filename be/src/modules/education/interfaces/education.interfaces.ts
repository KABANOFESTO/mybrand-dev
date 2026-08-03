export interface EducationView {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  score: string | null;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationDeleteResult {
  deleted: boolean;
}
