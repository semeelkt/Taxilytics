/**
 * Finreg - Account Book Module
 * Digital account book for tracking income and expenses
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
  onSnapshot,
  serverTimestamp
} from './firebase-config.js';

import { showSuccess, showError } from './notifications.js';
import { getCurrentUser } from './auth.js';

// Collection reference
const COLLECTION_NAME = 'transactions';

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

/**
 * Add a new transaction
 * @param {Object} data - Transaction data
 */
export async function addTransaction(data) {
  try {
    const user = getCurrentUser();
    if (!user) {
      showError('Please login to add transactions');
      return { success: false, error: 'Not authenticated' };
    }
    
    const transactionData = {
      userId: user.uid,
      title: data.title,
      amount: parseFloat(data.amount),
      type: data.type,
      date: data.date,
      description: data.description || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), transactionData);
    
    showSuccess(`${data.type === TRANSACTION_TYPES.INCOME ? 'Income' : 'Expense'} added successfully!`);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Add transaction error:', error);
    showError('Failed to add transaction. Please try again.');
    return { success: false, error: error.message };
  }
}

/**
 * Get all transactions for current user
 */
export async function getUserTransactions() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort client-side by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return { success: true, data: transactions };
  } catch (error) {
    console.error('Get transactions error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen for real-time updates to user transactions
 * @param {function} callback - Function to call with updated data
 */
export function subscribeToUserTransactions(callback) {
  const user = getCurrentUser();
  if (!user) {
    callback([]);
    return null;
  }
  
  // Simple query without orderBy to avoid index requirement
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid)
  );
  
  return onSnapshot(q, (snapshot) => {
    const transactions = [];
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    callback(transactions);
  }, (error) => {
    console.error('Subscription error:', error);
    callback([]);
  });
}

/**
 * Delete a transaction
 * @param {string} transactionId - Transaction ID
 */
export async function deleteTransaction(transactionId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, transactionId));
    showSuccess('Transaction deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete transaction error:', error);
    showError('Failed to delete transaction');
    return { success: false, error: error.message };
  }
}

/**
 * Update a transaction
 * @param {string} transactionId - Transaction ID
 * @param {Object} data - Updated data
 */
export async function updateTransaction(transactionId, data) {
  try {
    const docRef = doc(db, COLLECTION_NAME, transactionId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    showSuccess('Transaction updated');
    return { success: true };
  } catch (error) {
    console.error('Update transaction error:', error);
    showError('Failed to update transaction');
    return { success: false, error: error.message };
  }
}

/**
 * Calculate totals from transactions
 * @param {Array} transactions - Array of transactions
 */
export function calculateTotals(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  
  transactions.forEach(t => {
    if (t.type === TRANSACTION_TYPES.INCOME) {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });
  
  const profit = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    profit,
    transactionCount: transactions.length
  };
}

/**
 * Format currency for Indian Rupees
 * @param {number} amount - Amount to format
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get transactions for a specific month
 * @param {Array} transactions - All transactions
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 */
export function getMonthlyTransactions(transactions, month, year) {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}
