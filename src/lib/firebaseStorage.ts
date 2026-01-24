// Firebase Storage helper functions - FREE TIER VERSION
// Uses Base64 encoding instead of Firebase Storage (not available in free tier)
import { FirebaseResult } from './types';

/**
 * Convert image to Base64 and compress for Firestore storage
 * FREE TIER COMPATIBLE - No Firebase Storage needed
 */
export const convertImageToBase64 = async (
    file: File
): Promise<FirebaseResult<string>> => {
    try {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Only JPG, PNG, and WEBP images are allowed.',
            };
        }

        // Validate file size (max 5MB before compression)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File size exceeds 5MB. Please upload a smaller image.',
            };
        }

        // Compress image to fit within Firestore limits (target ~500KB)
        const compressedFile = await compressImage(file, 0.6); // More aggressive compression

        // Convert to Base64
        const base64String = await fileToBase64(compressedFile);

        // Check if Base64 string is within Firestore limits (~800KB to be safe)
        const sizeInBytes = new Blob([base64String]).size;
        if (sizeInBytes > 800000) {
            // Try more aggressive compression
            const moreCompressed = await compressImage(file, 0.4);
            const newBase64 = await fileToBase64(moreCompressed);
            const newSize = new Blob([newBase64]).size;

            if (newSize > 800000) {
                return {
                    success: false,
                    error: 'Image is too large even after compression. Please use a smaller image.',
                };
            }

            return {
                success: true,
                data: newBase64,
            };
        }

        return {
            success: true,
            data: base64String,
        };
    } catch (error: any) {
        console.error('Error converting image to Base64:', error);
        return {
            success: false,
            error: error.message || 'Failed to process image',
        };
    }
};

/**
 * Convert File to Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

/**
 * Compress image to reduce size for Firestore storage
 * More aggressive compression for Base64 storage
 */
const compressImage = async (file: File, quality: number = 0.6): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Smaller max dimensions for Base64 storage
                const maxWidth = 800;  // Reduced from 1200
                const maxHeight = 800; // Reduced from 1200
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file); // Fallback to original if compression fails
                        }
                    },
                    file.type,
                    quality // Use provided quality parameter
                );
            };
        };
    });
};
