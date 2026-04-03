/**
 * Finreg - Admin Module
 * Admin dashboard functionality for managing all users' data
 */

import {
  db,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  onSnapshot,
  serverTimestamp
} from './firebase-config.js';

import { showSuccess, showError } from './notifications.js';
import { getCurrentUser } from './auth.js';

// Admin email - only this user can access admin panel
export const ADMIN_EMAIL = 'mradminlogged@gmail.com';

/**
 * Check if current user is admin
 */
export function isAdmin() {
  const user = getCurrentUser();
  return user && user.email === ADMIN_EMAIL;
}

/**
 * Require admin access - redirect if not admin
 */
export function requireAdmin(redirectTo = '/') {
  const user = getCurrentUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    showError('Access denied. Admin only.');
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/**
 * Get all service requests from all users
 */
export async function getAllServiceRequests() {
  try {
    const q = query(collection(db, 'service_requests'));
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort client-side
    requests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: requests };
  } catch (error) {
    console.error('Get all requests error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to all service requests (real-time)
 */
export function subscribeToAllRequests(callback) {
  console.log('Admin: Subscribing to ALL service requests');
  const q = query(collection(db, 'service_requests'));
  
  return onSnapshot(q, (snapshot) => {
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    console.log('Admin: Received', requests.length, 'requests');
    // Sort client-side
    requests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    callback(requests);
  }, (error) => {
    console.error('Admin subscription error:', error);
    showError('Failed to load requests: ' + error.message);
    callback([]);
  });
}

/**
 * Update service request status
 */
export async function updateRequestStatus(requestId, newStatus) {
  try {
    const docRef = doc(db, 'service_requests', requestId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    showSuccess(`Status updated to "${newStatus}"`);
    return { success: true };
  } catch (error) {
    console.error('Update status error:', error);
    showError('Failed to update status');
    return { success: false, error: error.message };
  }
}

/**
 * Get all documents from all users
 */
export async function getAllDocuments() {
  try {
    const q = query(collection(db, 'documents'));
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort client-side
    documents.sort((a, b) => {
      const dateA = a.uploadedAt?.toDate?.() || new Date(0);
      const dateB = b.uploadedAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: documents };
  } catch (error) {
    console.error('Get all documents error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to all documents (real-time)
 */
export function subscribeToAllDocuments(callback) {
  const q = query(collection(db, 'documents'));
  
  return onSnapshot(q, (snapshot) => {
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side
    documents.sort((a, b) => {
      const dateA = a.uploadedAt?.toDate?.() || new Date(0);
      const dateB = b.uploadedAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    callback(documents);
  }, (error) => {
    console.error('Subscription error:', error);
    callback([]);
  });
}

/**
 * Get all users
 */
export async function getAllUsers() {
  try {
    const q = query(collection(db, 'users'));
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort client-side
    users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: users };
  } catch (error) {
    console.error('Get all users error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to all users (real-time)
 */
export function subscribeToAllUsers(callback) {
  const q = query(collection(db, 'users'));
  
  return onSnapshot(q, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side
    users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    callback(users);
  }, (error) => {
    console.error('Subscription error:', error);
    callback([]);
  });
}

/**
 * Get all transactions from all users
 */
export async function getAllTransactions() {
  try {
    const q = query(collection(db, 'transactions'));
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort client-side
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return { success: true, data: transactions };
  } catch (error) {
    console.error('Get all transactions error:', error);
    return { success: false, error: error.message };
  }
}
