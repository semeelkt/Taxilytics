/**
 * Finreg - Document Upload Module
 * Handles file uploads to Firebase Storage
 */

import {
  db,
  storage,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from './firebase-config.js';

import { showSuccess, showError, showWarning } from './notifications.js';
import { getCurrentUser } from './auth.js';

// Collection reference
const COLLECTION_NAME = 'documents';

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate file before upload
 * @param {File} file - File to validate
 */
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Please upload PDF or images only.' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit.' };
  }
  
  return { valid: true };
}

/**
 * Upload a document
 * @param {File} file - File to upload
 * @param {function} onProgress - Progress callback
 */
export async function uploadDocument(file, onProgress = null) {
  try {
    const user = getCurrentUser();
    if (!user) {
      showError('Please login to upload documents');
      return { success: false, error: 'Not authenticated' };
    }
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      showWarning(validation.error);
      return { success: false, error: validation.error };
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const filePath = `documents/${user.uid}/${filename}`;
    
    // Upload to Storage
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Store metadata in Firestore
    const docData = {
      userId: user.uid,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: filePath,
      downloadURL: downloadURL,
      uploadedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    
    showSuccess('Document uploaded successfully!');
    return { success: true, id: docRef.id, url: downloadURL };
  } catch (error) {
    console.error('Upload error:', error);
    showError('Failed to upload document. Please try again.');
    return { success: false, error: error.message };
  }
}

/**
 * Get all documents for current user
 */
export async function getUserDocuments() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: documents };
  } catch (error) {
    console.error('Get documents error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen for real-time updates to user documents
 * @param {function} callback - Function to call with updated data
 */
export function subscribeToUserDocuments(callback) {
  const user = getCurrentUser();
  if (!user) return null;
  
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid),
    orderBy('uploadedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  }, (error) => {
    console.error('Subscription error:', error);
  });
}

/**
 * Delete a document
 * @param {string} docId - Document ID
 * @param {string} storagePath - Storage path
 */
export async function deleteDocument(docId, storagePath) {
  try {
    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, docId));
    
    showSuccess('Document deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete document error:', error);
    showError('Failed to delete document');
    return { success: false, error: error.message };
  }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file icon based on type
 * @param {string} fileType - MIME type
 */
export function getFileIcon(fileType) {
  if (fileType === 'application/pdf') {
    return '📄';
  } else if (fileType.startsWith('image/')) {
    return '🖼️';
  }
  return '📎';
}
