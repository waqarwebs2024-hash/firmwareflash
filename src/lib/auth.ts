
'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET || "your-super-secret-key-that-is-long-enough";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in 1 day
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // IMPORTANT: In a real-world application, you should use environment variables for credentials
  // and compare hashed passwords. This is a simplified example for prototyping.
  if (email === 'waqaraliwebs@gmail.com' && password === '12345000') {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await encrypt({ email, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
    
    redirect('/admin');
  } else {
    // You should handle the error more gracefully, e.g., by redirecting back with an error message.
    redirect('/login?error=Invalid credentials');
  }
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

