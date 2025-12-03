export interface Upload {
  fileName: string;
  fileType: string;
  body: Buffer;
  folder?: string;
}

export interface UploadResult {
  key: string;
}

export interface PresignResult {
  uploadUrl: string;
  key: string;
}

export interface StorageProvider {
  upload(params: Upload): Promise<UploadResult>;

  delete(fileKeyOrUrl: string): Promise<void>;

  generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder?: string
  ): Promise<PresignResult>;

  getPresignedUrlFromKey(key: string): Promise<string>;
}
