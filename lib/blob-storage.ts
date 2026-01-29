/**
 * Vercel Blob Storage Utilities
 * Handles file uploads for hospital branding assets
 */

export interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  size: number;
}

export interface UploadOptions {
  folder?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

/**
 * Upload a file to Vercel Blob storage via API route
 * @param file - The file to upload
 * @param options - Upload options
 * @returns The blob URL and metadata
 */
export async function uploadToBlob(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = 'hospital-branding',
    maxSizeInMB = 2,
    allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'],
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  // Validate file size (convert MB to bytes)
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(
      `File size exceeds maximum allowed size of ${maxSizeInMB}MB`
    );
  }

  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Upload via API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return {
      url: result.url,
      pathname: result.pathname,
      contentType: result.contentType || file.type,
      contentDisposition: result.contentDisposition || `inline; filename="${file.name}"`,
      size: result.size || file.size,
    };
  } catch (error) {
    console.error('Blob upload error:', error);
    throw new Error(
      error instanceof Error 
        ? `Upload failed: ${error.message}` 
        : 'Upload failed. Please try again.'
    );
  }
}

/**
 * Upload a hospital logo to Vercel Blob storage
 * @param file - The logo file to upload
 * @returns The blob URL and metadata
 */
export async function uploadHospitalLogo(file: File): Promise<UploadResult> {
  return uploadToBlob(file, {
    folder: 'hospital-branding/logos',
    maxSizeInMB: 2,
    allowedTypes: ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'],
  });
}

/**
 * Upload a hospital background image to Vercel Blob storage
 * @param file - The background image file to upload
 * @returns The blob URL and metadata
 */
export async function uploadHospitalBackground(file: File): Promise<UploadResult> {
  return uploadToBlob(file, {
    folder: 'hospital-branding/backgrounds',
    maxSizeInMB: 3,
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  });
}

/**
 * Validate if a string is a valid Vercel Blob URL
 * @param url - The URL to validate
 * @returns True if valid blob URL
 */
export function isBlobUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('blob.vercel-storage.com') || 
           urlObj.hostname.includes('public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

/**
 * Extract the pathname from a blob URL
 * @param url - The blob URL
 * @returns The pathname or null if invalid
 */
export function getBlobPathname(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return null;
  }
}
