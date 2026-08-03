export type UploadScope = 'avatar' | 'resume' | 'project-image' | 'certificate-image' | 'certificate-pdf';

export interface StoredUpload {
  scope: UploadScope;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string | null;
  path: string;
  public: boolean;
}
