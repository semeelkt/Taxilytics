/**
 * Finreg - Notification System
 * Toast notifications for success, error, and warning messages
 */

// Create toast container if it doesn't exist
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms before auto-dismiss (default: 4000)
 */
export function showToast(message, type = 'info', duration = 4000) {
  initToastContainer();
  const container = document.querySelector('.toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon based on type
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
  `;
  
  container.appendChild(toast);
  
  // Auto-dismiss
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
  
  return toast;
}

/**
 * Show success toast
 */
export function showSuccess(message) {
  return showToast(message, 'success');
}

/**
 * Show error toast
 */
export function showError(message) {
  return showToast(message, 'error');
}

/**
 * Show warning toast
 */
export function showWarning(message) {
  return showToast(message, 'warning');
}

/**
 * Show info toast
 */
export function showInfo(message) {
  return showToast(message, 'info');
}
