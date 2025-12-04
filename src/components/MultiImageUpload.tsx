import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MultiImageUploadProps {
  userId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function MultiImageUpload({
  userId,
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      setError(`Maximal ${maxImages} Bilder erlaubt`);
      return;
    }

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} ist keine Bilddatei`);
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} ist zu groß (max 5MB)`);
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      // Add new images to existing ones
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Fehler beim Hochladen der Bilder');

      // Clean up any successfully uploaded images on error
      for (const url of uploadedUrls) {
        try {
          const path = url.split('/post-images/')[1];
          await supabase.storage.from('post-images').remove([path]);
        } catch (cleanupErr) {
          console.error('Error cleaning up:', cleanupErr);
        }
      }
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];

    try {
      // Extract path from URL
      const path = imageUrl.split('/post-images/')[1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('post-images')
        .remove([path]);

      if (deleteError) throw deleteError;

      // Remove from state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (err: any) {
      console.error('Error removing image:', err);
      setError('Fehler beim Löschen des Bildes');
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload button */}
      {images.length < maxImages && (
        <div>
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              disabled || uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                <span className="text-sm text-gray-600">Wird hochgeladen...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-gray-700">
                  Bilder hochladen ({images.length}/{maxImages})
                </span>
              </>
            )}
          </label>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF bis zu 5MB. Maximal {maxImages} Bilder.
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Bild entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !uploading && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <ImageIcon className="h-12 w-12 mb-2" />
          <p className="text-sm">Noch keine Bilder hochgeladen</p>
        </div>
      )}
    </div>
  );
}
