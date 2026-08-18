/**
 * Generates a deterministic CSS gradient from a string ID.
 * Used as album art fallback when no imageUrl is available.
 */
export function gradientFromId(id: string): string {
  // Simple hash to get a number from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  // Pick from a curated palette of gradients
  const gradients = [
    'linear-gradient(135deg, #4F9CF9 0%, #9B7FFF 100%)',
    'linear-gradient(135deg, #FF6B9D 0%, #FF9055 100%)',
    'linear-gradient(135deg, #4BDFDB 0%, #4F9CF9 100%)',
    'linear-gradient(135deg, #52E5B0 0%, #4BDFDB 100%)',
    'linear-gradient(135deg, #9B7FFF 0%, #FF6B9D 100%)',
    'linear-gradient(135deg, #FF9055 0%, #52E5B0 100%)',
    'linear-gradient(135deg, #4F9CF9 0%, #4BDFDB 100%)',
    'linear-gradient(135deg, #FF6B9D 0%, #9B7FFF 100%)',
    'linear-gradient(135deg, #52E5B0 0%, #9B7FFF 100%)',
    'linear-gradient(135deg, #4BDFDB 0%, #FF6B9D 100%)',
  ];

  return gradients[abs % gradients.length];
}
