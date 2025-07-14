import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils";

const PBKDF2_CONFIG = {
  iterations: 100_000,
  keyLen: 32,
  hash: "sha256",
};

const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  return a.reduce((acc, v, i) => acc | (v ^ b[i]), 0) === 0;
};

export const hashPassword = (password: string): string => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = pbkdf2(sha256, utf8ToBytes(password), salt, {
    c: PBKDF2_CONFIG.iterations,
    dkLen: PBKDF2_CONFIG.keyLen,
  });

  // Encode full hash string like: pbkdf2$sha256$100000$<salt>$<hash>
  return [
    "pbkdf2",
    PBKDF2_CONFIG.hash,
    PBKDF2_CONFIG.iterations,
    bytesToHex(salt),
    bytesToHex(derivedKey),
  ].join("$");
};

export const verifyPassword = (password: string, hashString: string): boolean => {
  const [type, hashAlg, iterStr, saltHex, keyHex] = hashString.split("$");
  if (type !== "pbkdf2" || hashAlg !== "sha256") return false;

  const iterations = parseInt(iterStr, 10);
  const salt = hexToBytes(saltHex);
  const expectedKey = hexToBytes(keyHex);

  const derivedKey = pbkdf2(sha256, utf8ToBytes(password), salt, {
    c: iterations,
    dkLen: expectedKey.length,
  });

  return timingSafeEqual(derivedKey, expectedKey);
};
