// Comprehensive IANA timezone list organized by region
export const timezones = [
  // Americas
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Phoenix", label: "Arizona" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "America/Mexico_City", label: "Mexico City" },
  { value: "America/Sao_Paulo", label: "São Paulo" },
  { value: "America/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/Bogota", label: "Bogotá" },
  { value: "America/Lima", label: "Lima" },
  { value: "America/Caracas", label: "Caracas" },
  
  // Europe
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris, Madrid, Berlin" },
  { value: "Europe/Rome", label: "Rome" },
  { value: "Europe/Amsterdam", label: "Amsterdam" },
  { value: "Europe/Brussels", label: "Brussels" },
  { value: "Europe/Vienna", label: "Vienna" },
  { value: "Europe/Zurich", label: "Zurich" },
  { value: "Europe/Stockholm", label: "Stockholm" },
  { value: "Europe/Copenhagen", label: "Copenhagen" },
  { value: "Europe/Warsaw", label: "Warsaw" },
  { value: "Europe/Prague", label: "Prague" },
  { value: "Europe/Budapest", label: "Budapest" },
  { value: "Europe/Athens", label: "Athens" },
  { value: "Europe/Helsinki", label: "Helsinki" },
  { value: "Europe/Istanbul", label: "Istanbul" },
  { value: "Europe/Moscow", label: "Moscow" },
  
  // Asia
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Karachi", label: "Karachi" },
  { value: "Asia/Kolkata", label: "Mumbai, Kolkata, New Delhi" },
  { value: "Asia/Bangkok", label: "Bangkok, Hanoi" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai" },
  { value: "Asia/Tokyo", label: "Tokyo, Osaka" },
  { value: "Asia/Seoul", label: "Seoul" },
  { value: "Asia/Manila", label: "Manila" },
  { value: "Asia/Jakarta", label: "Jakarta" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh City" },
  { value: "Asia/Taipei", label: "Taipei" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur" },
  { value: "Asia/Jerusalem", label: "Jerusalem" },
  { value: "Asia/Riyadh", label: "Riyadh" },
  
  // Pacific
  { value: "Australia/Sydney", label: "Sydney, Melbourne" },
  { value: "Australia/Brisbane", label: "Brisbane" },
  { value: "Australia/Adelaide", label: "Adelaide" },
  { value: "Australia/Perth", label: "Perth" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "Pacific/Fiji", label: "Fiji" },
  
  // Africa
  { value: "Africa/Cairo", label: "Cairo" },
  { value: "Africa/Johannesburg", label: "Johannesburg, Pretoria" },
  { value: "Africa/Lagos", label: "Lagos" },
  { value: "Africa/Nairobi", label: "Nairobi" },
  { value: "Africa/Casablanca", label: "Casablanca" },
  
  // Other
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
]

// Get browser's detected timezone
export function getDetectedTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}
