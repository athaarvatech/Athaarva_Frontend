/**
 * File Storage Utility
 *
 * Handles file uploads to the backend storage service
 * Supports: images, documents, medical files, branding assets
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UploadResult {
  url: string;
  id: string;
  filename: string;
  original_filename?: string;
  size: number;
  content_type: string;
  checksum?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadOptions {
  /** File to upload */
  file: File;
  /** Upload endpoint type */
  type: "image" | "document" | "medical" | "branding";
  /** Additional parameters based on type */
  params?: Record<string, string>;
  /** Auth token (optional) */
  token?: string;
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

export class StorageError extends Error {
  code: string;

  constructor(message: string, code: string = "UPLOAD_ERROR") {
    super(message);
    this.name = "StorageError";
    this.code = code;
  }
}

/**
 * Upload a file to the storage service
 */
export async function uploadFile(
  options: UploadOptions
): Promise<UploadResult> {
  const { file, type, params = {}, token, onProgress } = options;

  // Build endpoint URL
  let endpoint = `${API_BASE}/api/v1/uploads`;
  switch (type) {
    case "image":
      endpoint += "/images";
      break;
    case "document":
      endpoint += "/documents";
      break;
    case "medical":
      endpoint += "/medical";
      break;
    case "branding":
      endpoint += "/branding";
      break;
  }

  // Add query params
  const queryParams = new URLSearchParams(params).toString();
  if (queryParams) {
    endpoint += `?${queryParams}`;
  }

  // Create form data
  const formData = new FormData();
  formData.append("file", file);

  // Upload with progress tracking if callback provided
  if (onProgress) {
    return uploadWithProgress(endpoint, formData, token, onProgress);
  }

  // Simple upload
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Upload failed" }));
    throw new StorageError(error.detail || "Upload failed", "UPLOAD_FAILED");
  }

  return response.json();
}

/**
 * Upload with progress tracking using XMLHttpRequest
 */
function uploadWithProgress(
  endpoint: string,
  formData: FormData,
  token?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new StorageError("Invalid response", "INVALID_RESPONSE"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(
            new StorageError(error.detail || "Upload failed", "UPLOAD_FAILED")
          );
        } catch {
          reject(new StorageError("Upload failed", "UPLOAD_FAILED"));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new StorageError("Network error", "NETWORK_ERROR"));
    });

    xhr.open("POST", endpoint);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.send(formData);
  });
}

/**
 * Upload an image file
 */
export async function uploadImage(
  file: File,
  folder: string = "general",
  prefix?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const params: Record<string, string> = { folder };
  if (prefix) params.prefix = prefix;

  return uploadFile({
    file,
    type: "image",
    params,
    onProgress,
  });
}

/**
 * Upload a document file
 */
export async function uploadDocument(
  file: File,
  folder: string = "general",
  prefix?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const params: Record<string, string> = { folder };
  if (prefix) params.prefix = prefix;

  return uploadFile({
    file,
    type: "document",
    params,
    onProgress,
  });
}

/**
 * Upload a medical file
 */
export async function uploadMedicalFile(
  file: File,
  patientId: string,
  recordType: string = "report",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return uploadFile({
    file,
    type: "medical",
    params: {
      patient_id: patientId,
      record_type: recordType,
    },
    onProgress,
  });
}

/**
 * Upload a branding asset
 */
export async function uploadBrandingAsset(
  file: File,
  tenantId: string,
  assetType: "logo" | "background" | "favicon" = "logo",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return uploadFile({
    file,
    type: "branding",
    params: {
      tenant_id: tenantId,
      asset_type: assetType,
    },
    onProgress,
  });
}

/**
 * Delete a file
 */
export async function deleteFile(
  url: string,
  token?: string
): Promise<boolean> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE}/api/v1/uploads?url=${encodeURIComponent(url)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  return response.ok;
}

/**
 * Get a signed URL for temporary access
 */
export async function getSignedUrl(
  url: string,
  expiresIn: number = 3600
): Promise<string> {
  const response = await fetch(
    `${API_BASE}/api/v1/uploads/signed-url?url=${encodeURIComponent(
      url
    )}&expires_in=${expiresIn}`
  );

  if (!response.ok) {
    throw new StorageError("Failed to get signed URL", "SIGNED_URL_FAILED");
  }

  const data = await response.json();
  return data.url;
}

/**
 * Get file information
 */
export async function getFileInfo(url: string): Promise<{
  url: string;
  size: number;
  modified: string;
  content_type: string;
} | null> {
  const response = await fetch(
    `${API_BASE}/api/v1/uploads/info?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes,
    allowedExtensions,
  } = options;

  // Check size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${(
        maxSize /
        (1024 * 1024)
      ).toFixed(1)}MB)`,
    };
  }

  // Check type
  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type '${file.type}' is not allowed`,
      };
    }
  }

  // Check extension
  if (allowedExtensions && allowedExtensions.length > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File extension '${ext}' is not allowed`,
      };
    }
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file icon based on type
 */
export function getFileIcon(contentType: string): string {
  if (contentType.startsWith("image/")) return "🖼️";
  if (contentType.startsWith("video/")) return "🎬";
  if (contentType.startsWith("audio/")) return "🎵";
  if (contentType === "application/pdf") return "📄";
  if (contentType.includes("word")) return "📝";
  if (contentType.includes("excel") || contentType.includes("spreadsheet"))
    return "📊";
  if (contentType.includes("presentation")) return "📽️";
  return "📁";
}

const storageUtils = {
  uploadFile,
  uploadImage,
  uploadDocument,
  uploadMedicalFile,
  uploadBrandingAsset,
  deleteFile,
  getSignedUrl,
  getFileInfo,
  validateFile,
  formatFileSize,
  getFileIcon,
};

export default storageUtils;
