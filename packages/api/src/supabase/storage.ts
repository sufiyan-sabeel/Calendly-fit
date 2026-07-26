/**
 * Calendy Fit - Supabase Storage Service
 * File uploads, downloads, and management for all storage buckets
 */

import { getSupabaseClient } from './client';
import type { SupabaseClient } from './client';
import { STORAGE_BUCKETS } from '@calendy/config';

export interface UploadOptions {
  upsert?: boolean;
  contentType?: string;
  cacheControl?: string;
}

export interface UploadResult {
  path: string;
  url: string;
  publicUrl: string;
}

export class SupabaseStorageService {
  private client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient();
  }

  /**
   * Upload a file to a storage bucket
   */
  async upload(
    bucket: string,
    path: string,
    file: File | Blob | Uint8Array | ArrayBuffer,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? true,
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || '3600',
      });

    if (error) throw error;

    const { data: urlData } = await this.client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
      publicUrl: urlData.publicUrl,
    };
  }

  /**
   * Download a file from storage
   */
  async download(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return data;
  }

  /**
   * Get a public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Get a signed URL for private files (temporary access)
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  }

  /**
   * List files in a directory
   */
  async listFiles(
    bucket: string,
    folder: string = ''
  ): Promise<{ name: string; url: string; updatedAt: string }[]> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .list(folder);

    if (error) throw error;

    return data.map((file) => ({
      name: file.name,
      url: this.getPublicUrl(bucket, `${folder}/${file.name}`),
      updatedAt: file.updated_at,
    }));
  }

  /**
   * Delete a file
   */
  async delete(bucket: string, paths: string[]): Promise<void> {
    const { error } = await this.client.storage
      .from(bucket)
      .remove(paths);

    if (error) throw error;
  }

  /**
   * Move/rename a file
   */
  async move(
    bucket: string,
    fromPath: string,
    toPath: string
  ): Promise<void> {
    const { error } = await this.client.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) throw error;
  }

  // ---- Convenience methods for specific buckets ----

  async uploadAvatar(
    userId: string,
    file: File | Blob,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const ext = (file instanceof File ? file.name : 'avatar').split('.').pop() || 'jpg';
    const path = `${userId}/avatar.${ext}`;
    return this.upload(STORAGE_BUCKETS.AVATARS, path, file, {
      ...options,
      contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
    });
  }

  async uploadProgressPhoto(
    userId: string,
    date: string,
    file: File | Blob,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const ext = (file instanceof File ? file.name : 'photo').split('.').pop() || 'jpg';
    const path = `${userId}/${date}.${ext}`;
    return this.upload(STORAGE_BUCKETS.PROGRESS_PHOTOS, path, file, {
      ...options,
      contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
    });
  }

  async uploadCertificate(
    trainerId: string,
    file: File | Blob,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const path = `${trainerId}/${(file instanceof File ? file.name : 'certificate.pdf')}`;
    return this.upload(STORAGE_BUCKETS.TRAINER_CERTIFICATES, path, file, options);
  }
}

export const supabaseStorage = new SupabaseStorageService();
