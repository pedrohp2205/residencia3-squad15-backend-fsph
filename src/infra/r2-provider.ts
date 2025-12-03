import { StorageProvider, Upload } from "@/storage/storage-provider";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export class R2Provider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY!;
    const bucket = process.env.CLOUDFLARE_BUCKET_NAME!;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "R2 env vars missing: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_SECRET_ACCESS_KEY, CLOUDFLARE_BUCKET_NAME"
      );
    }

    this.bucket = bucket;
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private extractKey(input: string): string {
    try {
      const u = new URL(input);
      return u.pathname.replace(/^\/+/, "");
    } catch {
      return input;
    }
  }

  private buildKey(fileName: string, folder?: string): string {
    const cleanFolder = (folder ?? "").replace(/^\/+/, "").replace(/\/+$/, "");
    return cleanFolder ? `${cleanFolder}/${fileName}` : fileName;
  }

  async upload({
    fileName,
    fileType,
    body,
    folder,
  }: Upload): Promise<{ key: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;
    const key = this.buildKey(uniqueFileName, folder);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: fileType,
        Body: body,
        ContentLength: Buffer.isBuffer(body) ? body.length : undefined,
      })
    );

    return { key };
  }

  async delete(fileKeyOrUrl: string): Promise<void> {
    const key = this.extractKey(fileKeyOrUrl);
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder?: string
  ): Promise<{
    uploadUrl: string;
    key: string;
  }> {
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const key = this.buildKey(uniqueFileName, folder);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 5, // 5 minutos
    });

    return { uploadUrl, key };
  }

  async getPresignedUrlFromKey(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 15, 
    });

    return url;
  }

  /**
   * Retorna uma URL pública caso você tenha configurado o bucket como público
   * atrás de um domínio (ex.: via Cloudflare R2 + R2.dev ou domínio próprio).
   * Sete CLOUDFLARE_PUBLIC_BASE_URL, ex.: https://media.seudominio.com
   */
  getPublicUrl(key: string): string | null {
    const base = process.env.CLOUDFLARE_PUBLIC_BASE_URL;
    if (!base) return null;

    // Evita barras duplas e preserva subpastas:
    const normalized = key.replace(/^\/+/, "");
    // Se quiser escapar cada segmento:
    const parts = normalized.split("/").map(encodeURIComponent).join("/");
    return `${base.replace(/\/+$/, "")}/${parts}`;
  }
}
