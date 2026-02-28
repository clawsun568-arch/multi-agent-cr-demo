/**
 * Type definitions for Cat data
 * Supports both owned cats and planned (future) cats
 */

export type CatStatus = 'owned' | 'planned';

export interface HeroImage {
  url: string;
  alt: string;
}

export interface SiteConfig {
  catteryName: string;
  tagline: string;
  introText: string;
  heroImages: HeroImage[];
}

export interface Photo {
  url: string;
  caption?: string;
}

export interface Cat {
  // Basic info
  id: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  status: CatStatus;
  
  // Dates
  birthDate?: string;      // ISO date string (e.g., "2024-03-15")
  expectedDate?: string;   // For planned cats (e.g., "2025-06")
  
  // Photos
  photoUrl: string;        // Main/hero photo
  gallery?: Photo[];       // Additional photos for profile page
  
  // Role & appearance
  role?: 'king' | 'queen' | 'kitten';
  color?: string;          // Coat color (e.g. "Seal Point")

  // Details
  personality?: string;    // Description of cat's personality
  
  // Lineage (optional)
  father?: string;         // Father's name
  mother?: string;         // Mother's name
}
