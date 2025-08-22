/**
 * Calculates whether black or white text should be used for a given hex background color.
 * @param hexColor - The background color in hex format (e.g., '#ff9800').
 * @returns '#000000' (black) for light backgrounds or '#FFFFFF' (white) for dark backgrounds.
 */
export function getContrastColor(hexColor: string): string {
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.slice(1)
  }
  const r = parseInt(hexColor.substr(0, 2), 16)
  const g = parseInt(hexColor.substr(2, 2), 16)
  const b = parseInt(hexColor.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.6 ? '#000000' : '#FFFFFF'
}
