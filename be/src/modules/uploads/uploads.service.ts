import { BadRequestException, Injectable } from '@nestjs/common';
import type { File as MulterFile } from 'multer';
import { buildPublicUploadUrl, ensureUploadFolder, getUploadScopeConfig } from './helpers/upload-storage.helper';
import type { StoredUpload, UploadScope } from './interfaces/upload.interfaces';

@Injectable()
export class UploadsService {
  constructor() {
    for (const scope of ['avatar', 'resume', 'project-image', 'certificate-image', 'certificate-pdf'] as UploadScope[]) {
      ensureUploadFolder(scope);
    }
  }

  storeFile(scope: UploadScope, file: MulterFile): StoredUpload {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const config = getUploadScopeConfig(scope);
    const url = buildPublicUploadUrl(scope, file.filename);

    return {
      scope,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      path: file.path,
      public: config.public,
    };
  }
}
