export interface CertificateView {
  id: string;
  title: string;
  issuer: string;
  credentialId: string | null;
  issuedAt: Date;
  expiredAt: Date | null;
  verificationUrl: string | null;
  pdfUrl: string | null;
  imageUrl: string | null;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateDeleteResult {
  deleted: boolean;
}
