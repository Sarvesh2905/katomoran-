import crypto from 'crypto';

export const generateShortCode = (length = 7) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length).replace(/[+/]/g, '0');
};