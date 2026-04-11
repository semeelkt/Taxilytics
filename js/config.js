/**
 * Finreg Configuration
 * Admin token and security settings
 */

// Admin panel access token - Change this to a secure token
// Owner should update this value with their own secret token
export const ADMIN_TOKEN = 'finreg-admin-2024-secret';

// Admin email address - where notifications will be sent
export const ADMIN_EMAIL = 'mohammedshameemkt570@gmail.com';

/**
 * Validate admin token
 * @param {string} token - Token to validate
 * @returns {boolean} True if token is valid
 */
export function validateAdminToken(token) {
  return token === ADMIN_TOKEN;
}
