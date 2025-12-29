import { customAlphabet } from 'nanoid';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 6;

const nanoid = customAlphabet(ALPHABET, CODE_LENGTH);

export function generateShortCode() {
    return nanoid();
}