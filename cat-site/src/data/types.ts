// TypeScript interfaces define the shape of our data
// This catches errors at compile time (e.g., using wrong field names)

export type CatStatus = 'owned' | 'planned';

export interface Cat {
  id: string;           // Unique identifier (e.g., "cat_001")
  name: string;         // Display name
  status: CatStatus;    // 'owned' = current pet, 'planned' = future kitten
  photoUrl: string;     // Path to image file (must be http/https or relative path)
  birthDate: string | null;  // ISO date string (null for planned cats)
  expectedDate: string | null;  // When planned cat is coming (e.g., "2025-06")
  breed: string | null; // Cat breed (optional)
  personality: string | null;  // Short description
  notes: string | null; // Additional info
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}

// Validate photoUrl to prevent XSS via javascript: URLs
export function isValidPhotoUrl(url: string): boolean {
  if (!url) return false;
  // Allow relative paths (start with /) or http/https URLs
  return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://');
}
