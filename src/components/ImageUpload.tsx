import { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  userId: string;
  size?: 'small' | 'medium' | 'large';
  autoSave?: boolean; // Auto-save to database immediately after upload
}

export default function ImageUpload({ currentImageUrl, onImageUpload, userId, size = 'medium', autoSave = false }: ImageUploadProps) {
  const { showSuccess, showError, showWarning } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const iconSizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showWarning('Bitte wählen Sie eine Bilddatei aus.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showWarning('Die Datei ist zu groß. Maximale Dateigröße: 5MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;

      if (currentImageUrl) {
        const oldPath = currentImageUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageUpload(publicUrl);

      // Auto-save to database if enabled
      if (autoSave) {
        const { error: dbError } = await supabase
          .from('workers')
          .update({
            image_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (dbError) {
          console.error('Error auto-saving to database:', dbError);
          showWarning('Bild hochgeladen, aber Fehler beim Speichern in der Datenbank. Bitte speichern Sie Ihr Profil manuell.');
        } else {
          showSuccess('Profilbild erfolgreich hochgeladen');
        }
      } else {
        showSuccess('Bild erfolgreich hochgeladen');
      }
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      showError(`Fehler beim Hochladen des Bildes: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    try {
      const path = currentImageUrl.split('/').slice(-2).join('/');

      const { error } = await supabase.storage
        .from('profile-pictures')
        .remove([path]);

      if (error) throw error;

      setPreviewUrl(undefined);
      onImageUpload('');
      showSuccess('Bild erfolgreich entfernt');
    } catch (error) {
      console.error('Error removing image:', error);
      showError('Fehler beim Entfernen des Bildes');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg`}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-yellow-400">
            <User className={`${iconSizes[size]} text-gray-900`} />
          </div>
        )}

        {previewUrl && (
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          type="button"
          className="flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Wird hochgeladen...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {previewUrl ? 'Bild ändern' : 'Bild hochladen'}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG oder GIF (max. 5MB)
        </p>
      </div>
    </div>
  );
}
