// Storage key for access code
const ACCESS_CODE_KEY = "kidable_access_code";

// Get access code from storage
export function getAccessCode(): string | null {
  return localStorage.getItem(ACCESS_CODE_KEY);
}

// Set access code in storage
export function setAccessCode(code: string): void {
  localStorage.setItem(ACCESS_CODE_KEY, code);
}

// Clear access code from storage
export function clearAccessCode(): void {
  localStorage.removeItem(ACCESS_CODE_KEY);
}