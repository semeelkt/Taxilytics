/**
 * Finreg - Client Submissions Module
 * Handles public form submissions without authentication
 */

import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs
} from './firebase-config.js';

import { showSuccess, showError } from './notifications.js';
import { validateAdminToken } from './config.js';

const SUBMISSIONS_COLLECTION = 'client_submissions';

/**
 * Submit client information (no auth required)
 * @param {Object} data - Submission data {name, email, phone, notes}
 * @returns {Object} {success: boolean, id: string, error: string}
 */
export async function submitClientInfo(data) {
  try {
    if (!data.name || !data.email || !data.phone) {
      throw new Error('Name, email, and phone are required');
    }

    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      notes: data.notes?.trim() || '',
      submittedAt: serverTimestamp()
    });

    showSuccess('Thank you! We will contact you soon.');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Submission error:', error);
    showError(error.message || 'Failed to submit. Please try again.');
    return { success: false, error: error.message };
  }
}

/**
 * Get all submissions (admin only - requires valid token)
 * @param {string} token - Admin token
 * @returns {Promise<Array>} Array of submissions
 */
export async function getAllSubmissions(token) {
  if (!validateAdminToken(token)) {
    throw new Error('Unauthorized');
  }

  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get submissions error:', error);
    throw error;
  }
}

/**
 * Subscribe to all submissions in real-time (admin only)
 * @param {string} token - Admin token
 * @param {Function} callback - Callback function to receive data
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAllSubmissions(token, callback) {
  if (!validateAdminToken(token)) {
    throw new Error('Unauthorized');
  }

  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(submissions);
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    throw error;
  }
}

/**
 * Delete a submission (admin only)
 * @param {string} token - Admin token
 * @param {string} submissionId - Submission ID to delete
 * @returns {Promise<Object>} {success: boolean, error: string}
 */
export async function deleteSubmission(token, submissionId) {
  if (!validateAdminToken(token)) {
    throw new Error('Unauthorized');
  }

  try {
    await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId));
    showSuccess('Submission deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    showError('Failed to delete submission');
    return { success: false, error: error.message };
  }
}
