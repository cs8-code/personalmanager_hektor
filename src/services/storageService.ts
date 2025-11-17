/**
 * Storage Service
 * Handles all file storage operations (Supabase Storage)
 */

import { supabase } from '../lib/supabase';

const PROFILE_PICTURES_BUCKET = 'profile-pictures';

export const storageService = {
  /**
   * Upload a profile picture
   */
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;

    // Delete old profile picture if exists
    await this.deleteProfilePicture(userId);

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  /**
   * Delete a profile picture
   */
  async deleteProfilePicture(userId: string): Promise<void> {
    // List all files for the user
    const { data: files, error: listError } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .list(userId);

    if (listError) throw listError;
    if (!files || files.length === 0) return;

    // Delete all files
    const filePaths = files.map(file => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .remove(filePaths);

    if (deleteError) throw deleteError;
  },

  /**
   * Get profile picture URL
   */
  getProfilePictureUrl(userId: string, fileName: string): string {
    const { data } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(`${userId}/${fileName}`);

    return data.publicUrl;
  },

  /**
   * Validate file type
   */
  isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  },

  /**
   * Validate file size (max 5MB)
   */
  isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  /**
   * Validate image file
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!this.isValidImageType(file)) {
      return {
        valid: false,
        error: 'Ungültiger Dateityp. Bitte laden Sie ein Bild hoch (JPEG, PNG, GIF, WebP).',
      };
    }

    if (!this.isValidFileSize(file, 5)) {
      return {
        valid: false,
        error: 'Die Datei ist zu groß. Maximale Dateigröße: 5MB.',
      };
    }

    return { valid: true };
  },
};
