import * as crypto from 'crypto';

export default function generateRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

export function generatePassword(length) {
  return crypto.randomBytes(length).toString('hex');
}
