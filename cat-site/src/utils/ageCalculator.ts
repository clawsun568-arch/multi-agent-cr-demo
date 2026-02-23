/**
 * Calculates age string from birth date
 * Example: "2022-03-15" → "2 years old"
 * Example: "2024-01-10" → "4 months old"
 * 
 * Why not store age directly? Age changes every day!
 * Storing birthDate and computing on display keeps it accurate.
 */
export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  // Adjust if birthday hasn't happened this year yet
  const adjustedYearDiff = monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate()) 
    ? yearDiff - 1 
    : yearDiff;
  
  const adjustedMonthDiff = monthDiff < 0 
    ? monthDiff + 12 
    : monthDiff;
  
  if (adjustedYearDiff > 0) {
    return `${adjustedYearDiff} year${adjustedYearDiff === 1 ? '' : 's'} old`;
  }
  
  return `${adjustedMonthDiff} month${adjustedMonthDiff === 1 ? '' : 's'} old`;
}
