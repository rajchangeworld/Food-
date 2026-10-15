import crypto from 'crypto';

/**
 * Generate a unique readable Order ID e.g., CRV-8492
 */
export function generateOrderId(prefix = 'CRV') {
  const randomNum = crypto.randomInt(1000, 9999);
  return `${prefix}-${randomNum}`;
}
