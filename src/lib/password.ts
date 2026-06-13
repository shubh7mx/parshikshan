// Web Crypto-based password hashing for Edge Runtime (Cloudflare Workers)
// Uses PBKDF2-SHA512 with a random salt, compatible with Edge Runtime

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
}

const ITERATIONS = 100000;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const keyMaterial = await getKeyMaterial(password);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-512',
    },
    keyMaterial,
    512
  );

  const hashBytes = new Uint8Array(derivedBits);
  const result = new Uint8Array(salt.length + hashBytes.length);
  result.set(salt);
  result.set(hashBytes, salt.length);

  return `pbkdf2_sha512\$${ITERATIONS}\$${arrayBufferToBase64(result.buffer)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [, iterationsStr, dataBase64] = stored.split('$');
    const iterations = parseInt(iterationsStr, 10);
    const data = new Uint8Array(base64ToArrayBuffer(dataBase64));

    const salt = data.slice(0, SALT_LENGTH);
    const originalHash = data.slice(SALT_LENGTH);

    const keyMaterial = await getKeyMaterial(password);
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-512',
      },
      keyMaterial,
      512
    );

    const derivedBytes = new Uint8Array(derivedBits);

    if (originalHash.length !== derivedBytes.length) return false;

    let mismatch = 0;
    for (let i = 0; i < originalHash.length; i++) {
      mismatch |= originalHash[i] ^ derivedBytes[i];
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}
