import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { Options as MulterOptions } from 'multer';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { UploadScope } from '../interfaces/upload.interfaces';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const PDF_MIME_TYPES = ['application/pdf'];

const SCOPES: Record<UploadScope, { folder: string; mimeTypes: string[]; public: boolean }> = {
  avatar: { folder: 'avatars', mimeTypes: IMAGE_MIME_TYPES, public: true },
  resume: { folder: 'resumes', mimeTypes: PDF_MIME_TYPES, public: false },
  'project-image': { folder: 'projects', mimeTypes: IMAGE_MIME_TYPES, public: true },
  'certificate-image': { folder: 'certificates/images', mimeTypes: IMAGE_MIME_TYPES, public: true },
  'certificate-pdf': { folder: 'certificates/pdfs', mimeTypes: PDF_MIME_TYPES, public: false },
};

export function getUploadScopeConfig(scope: UploadScope) {
  return SCOPES[scope];
}

export function buildUploadFolder(scope: UploadScope) {
  return join(process.cwd(), 'uploads', getUploadScopeConfig(scope).folder);
}

export function ensureUploadFolder(scope: UploadScope) {
  mkdirSync(buildUploadFolder(scope), { recursive: true });
}

export function buildUploadFilename(scope: UploadScope, mimetype: string) {
  const extension = getExtension(mimetype);
  return `${scope}-${randomUUID()}${extension}`;
}

export function buildPublicUploadUrl(scope: UploadScope, filename: string) {
  const config = getUploadScopeConfig(scope);
  if (!config.public) {
    return null;
  }

  return `/uploads/${config.folder}/${filename}`;
}

export function buildUploadMulterOptions(scope: UploadScope, maxFileSize: number): MulterOptions {
  ensureUploadFolder(scope);
  const config = getUploadScopeConfig(scope);

  return {
    storage: diskStorage({
      destination: (_req, _file, callback) => {
        callback(null, buildUploadFolder(scope));
      },
      filename: (_req, file, callback) => {
        if (!config.mimeTypes.includes(file.mimetype)) {
          callback(new BadRequestException(`Unsupported file type for ${scope}`) as unknown as Error, '');
          return;
        }

        callback(null, buildUploadFilename(scope, file.mimetype));
      },
    }),
    fileFilter: (_req, file, callback) => {
      if (!config.mimeTypes.includes(file.mimetype)) {
        callback(new BadRequestException(`Unsupported file type for ${scope}`) as unknown as Error, false);
        return;
      }

      callback(null, true);
    },
    limits: {
      fileSize: maxFileSize,
    },
  };
}

function getExtension(mimetype: string) {
  switch (mimetype) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'application/pdf':
      return '.pdf';
    default:
      throw new BadRequestException('Unsupported file type');
  }
}
