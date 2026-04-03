/**
 * Finreg - GST Calculator Module
 * Calculate GST amounts for Indian tax rates
 */

// Available GST rates in India
export const GST_RATES = [
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' }
];

/**
 * Calculate GST from an amount (exclusive)
 * @param {number} amount - Base amount
 * @param {number} rate - GST rate percentage
 * @returns {Object} - GST amount and total
 */
export function calculateGSTExclusive(amount, rate) {
  if (isNaN(amount) || amount < 0) {
    return { gstAmount: 0, total: 0, cgst: 0, sgst: 0 };
  }
  
  const gstAmount = (amount * rate) / 100;
  const total = amount + gstAmount;
  
  // CGST and SGST are equal halves of GST for intra-state
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  
  return {
    baseAmount: amount,
    gstAmount: gstAmount,
    cgst: cgst,
    sgst: sgst,
    total: total,
    rate: rate
  };
}

/**
 * Calculate GST from an amount (inclusive)
 * Used when the price already includes GST
 * @param {number} totalAmount - Total amount including GST
 * @param {number} rate - GST rate percentage
 * @returns {Object} - Base amount, GST amount
 */
export function calculateGSTInclusive(totalAmount, rate) {
  if (isNaN(totalAmount) || totalAmount < 0) {
    return { baseAmount: 0, gstAmount: 0, cgst: 0, sgst: 0 };
  }
  
  const baseAmount = (totalAmount * 100) / (100 + rate);
  const gstAmount = totalAmount - baseAmount;
  
  // CGST and SGST are equal halves
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  
  return {
    baseAmount: baseAmount,
    gstAmount: gstAmount,
    cgst: cgst,
    sgst: sgst,
    total: totalAmount,
    rate: rate
  };
}

/**
 * Format currency for Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount
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
 * Initialize GST calculator on a page
 * @param {string} formId - ID of the calculator form
 * @param {string} resultId - ID of the result container
 */
export function initCalculator(formId, resultId) {
  const form = document.getElementById(formId);
  const resultContainer = document.getElementById(resultId);
  
  if (!form || !resultContainer) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const amount = parseFloat(form.querySelector('[name="amount"]').value) || 0;
    const rate = parseFloat(form.querySelector('[name="gst-rate"]').value) || 18;
    const calcType = form.querySelector('[name="calc-type"]')?.value || 'exclusive';
    
    let result;
    if (calcType === 'inclusive') {
      result = calculateGSTInclusive(amount, rate);
    } else {
      result = calculateGSTExclusive(amount, rate);
    }
    
    // Update result display
    renderResult(resultContainer, result, calcType);
  });
}

/**
 * Render calculation result
 */
function renderResult(container, result, calcType) {
  const isInclusive = calcType === 'inclusive';
  
  container.innerHTML = `
    <div class="calculator-result">
      <div class="calculator-result-row">
        <span>${isInclusive ? 'Total Amount (incl. GST)' : 'Base Amount'}</span>
        <span>${formatCurrency(isInclusive ? result.total : result.baseAmount)}</span>
      </div>
      <div class="calculator-result-row">
        <span>CGST (${result.rate / 2}%)</span>
        <span>${formatCurrency(result.cgst)}</span>
      </div>
      <div class="calculator-result-row">
        <span>SGST (${result.rate / 2}%)</span>
        <span>${formatCurrency(result.sgst)}</span>
      </div>
      <div class="calculator-result-row">
        <span>Total GST (${result.rate}%)</span>
        <span>${formatCurrency(result.gstAmount)}</span>
      </div>
      <div class="calculator-result-row">
        <span><strong>${isInclusive ? 'Base Amount' : 'Total Amount'}</strong></span>
        <span><strong>${formatCurrency(isInclusive ? result.baseAmount : result.total)}</strong></span>
      </div>
    </div>
  `;
  
  container.classList.remove('hidden');
}
