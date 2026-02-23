/**
 * Calculates age string from birth date
 * Example: "2022-03-15" → "2 years old"
 * Example: "2024-01-10" → "4 months old"
 * Example: "2025-02-20" (future) → "Unknown age"
 * Example: "2025-02-10" (2 weeks old) → "2 weeks old"
 * 
 * Why not store age directly? Age changes every day!
 * Storing birthDate and computing on display keeps it accurate.
 */
export function calculateAge(birthDate: string): string {
  // Parse as UTC to avoid timezone issues
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const now = new Date();
  
  // Validate: reject future dates and invalid dates
  if (isNaN(birth.getTime()) || birth > now) {
    return 'Unknown age';
  }
  
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  const dayDiff = now.getDate() - birth.getDate();
  
  // Adjust if birthday hasn't happened this year yet
  const adjustedYearDiff = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) 
    ? yearDiff - 1 
    : yearDiff;
  
  const adjustedMonthDiff = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
    ? monthDiff + 12 
    : monthDiff;
  
  if (adjustedYearDiff > 0) {
    return `${adjustedYearDiff} year${adjustedYearDiff === 1 ? '' : 's'} old`;
  }
  
  if (adjustedMonthDiff > 0) {
    return `${adjustedMonthDiff} month${adjustedMonthDiff === 1 ? '' : 's'} old`;
  }
  
  // For very young kittens (less than 1 month), show weeks or days
  const daysOld = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysOld >= 7) {
    const weeks = Math.floor(daysOld / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} old`;
  }
  
  return `${daysOld} day${daysOld === 1 ? '' : 's'} old`;
}
