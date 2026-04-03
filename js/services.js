/**
 * Finreg - Service Requests Module
 * Handles creating and fetching service requests
 */

import {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from './firebase-config.js';

import { showSuccess, showError } from './notifications.js';
import { getCurrentUser } from './auth.js';

// Collection reference
const COLLECTION_NAME = 'service_requests';

/**
 * Service types available
 */
export const SERVICE_TYPES = [
  { id: 'gst-registration', name: 'GST Registration' },
  { id: 'tds-filing', name: 'TDS Filing' },
  { id: 'itr-filing', name: 'Income Tax Return (ITR)' },
  { id: 'bookkeeping', name: 'Bookkeeping' },
  { id: 'tax-consultancy', name: 'Tax Consultancy' }
];

/**
 * Request statuses
 */
export const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

/**
 * Create a new service request
 * @param {Object} data - Request data
 */
export async function createServiceRequest(data) {
  try {
    const user = getCurrentUser();
    if (!user) {
      showError('Please login to submit a request');
      return { success: false, error: 'Not authenticated' };
    }
    
    const requestData = {
      userId: user.uid,
      userEmail: user.email,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceType: data.serviceType,
      description: data.description || '',
      status: STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), requestData);
    
    showSuccess('Service request submitted successfully!');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Create request error:', error);
    showError('Failed to submit request. Please try again.');
    return { success: false, error: error.message };
  }
}

/**
 * Get all service requests for current user
 */
export async function getUserRequests() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: requests };
  } catch (error) {
    console.error('Get requests error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen for real-time updates to user requests
 * @param {function} callback - Function to call with updated data
 */
export function subscribeToUserRequests(callback) {
  const user = getCurrentUser();
  if (!user) return null;
  
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    callback(requests);
  }, (error) => {
    console.error('Subscription error:', error);
  });
}

/**
 * Delete a service request
 * @param {string} requestId - Request ID
 */
export async function deleteServiceRequest(requestId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, requestId));
    showSuccess('Request deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete request error:', error);
    showError('Failed to delete request');
    return { success: false, error: error.message };
  }
}

/**
 * Get status badge class
 * @param {string} status - Status string
 */
export function getStatusBadgeClass(status) {
  switch (status) {
    case STATUS.PENDING:
      return 'badge-pending';
    case STATUS.IN_PROGRESS:
      return 'badge-progress';
    case STATUS.COMPLETED:
      return 'badge-completed';
    default:
      return 'badge-pending';
  }
}
