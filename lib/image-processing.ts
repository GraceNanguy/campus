import { supabase } from './supabase';

interface ImageConfig {
  maxWidth: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
}

const defaultImageConfig: ImageConfig = {
  maxWidth: 1200,
  quality: 80,
  format: 'webp'
};

export const compressAndUploadImage = async (
  file: File,
  path: string,
  config: Partial<ImageConfig> = {}
): Promise<string | null> => {
  const settings = { ...defaultImageConfig, ...config };
  
  try {
    // Créer un canvas pour redimensionner l'image
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Charger l'image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    
    // Calculer les dimensions
    let width = img.width;
    let height = img.height;
    
    if (width > settings.maxWidth) {
      height = (height * settings.maxWidth) / width;
      width = settings.maxWidth;
    }
    
    // Configurer le canvas
    canvas.width = width;
    canvas.height = height;
    
    // Dessiner l'image redimensionnée
    ctx?.drawImage(img, 0, 0, width, height);
    
    // Convertir en Blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b as Blob),
        `image/${settings.format}`,
        settings.quality / 100
      );
    });
    
    // Upload vers Supabase Storage
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.${settings.format}`;
    const fullPath = `${path}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('course-images')
      .upload(fullPath, blob, {
        contentType: `image/${settings.format}`
      });
      
    if (error) throw error;
    
    // Retourner l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(fullPath);
      
    return publicUrl;
    
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image:', error);
    return null;
  }
};
