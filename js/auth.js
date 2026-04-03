/**
 * Finreg - Authentication Module
 * Handles user signup, login, logout, and session management
 */

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from './firebase-config.js';

import { showSuccess, showError } from './notifications.js';

/**
 * Sign up a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Whether to persist session
 */
export async function signUp(name, email, password, rememberMe = false) {
  try {
    // Set persistence based on remember me
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: name });
    
    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    showSuccess('Account created successfully!');
    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    const message = getAuthErrorMessage(error.code);
    showError(message);
    return { success: false, error: message };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Whether to persist session
 */
export async function signIn(email, password, rememberMe = false) {
  try {
    // Set persistence based on remember me
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    
    // Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Ensure user exists in Firestore (for users created before Finreg)
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create user document for existing Firebase Auth user
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    showSuccess('Welcome back!');
    return { success: true, user };
  } catch (error) {
    console.error('Sign in error:', error);
    const message = getAuthErrorMessage(error.code);
    showError(message);
    return { success: false, error: message };
  }
}

/**
 * Sign out the current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    showSuccess('Signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    showError('Failed to sign out');
    return { success: false, error: error.message };
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen for auth state changes
 * @param {function} callback - Function to call on auth state change
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get user profile from Firestore
 * @param {string} uid - User ID
 */
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user is logged in and redirect accordingly
 * @param {string} redirectTo - Page to redirect to if logged in
 */
export function requireAuth(redirectTo = '/pages/login.html') {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirectTo;
        resolve(null);
      } else {
        resolve(user);
      }
    });
  });
}

/**
 * Redirect logged-in users away from auth pages
 * @param {string} redirectTo - Page to redirect to if logged in
 */
export function redirectIfLoggedIn(redirectTo = '/pages/dashboard.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = redirectTo;
    }
  });
}

/**
 * Get user-friendly error messages
 * @param {string} errorCode - Firebase error code
 */
function getAuthErrorMessage(errorCode) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/invalid-credential': 'Invalid email or password'
  };
  
  return messages[errorCode] || 'An error occurred. Please try again.';
}
