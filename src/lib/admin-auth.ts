const ADMIN_AUTH_KEY = "lotus-admin-auth";
const ADMIN_PASSWORD_KEY = "lotus-admin-password";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function getAdminPassword(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY);
}

export function setAdminAuthenticated(value: boolean, password?: string): void {
  if (typeof window === "undefined") return;
  if (value) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    if (password) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
    }
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  }
}

export function updateAdminPassword(password: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}
