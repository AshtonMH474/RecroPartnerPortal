// lib/custom-auth-provider.ts
import { AbstractAuthProvider } from "tinacms";
import { signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";



export class CustomAuthProvider extends AbstractAuthProvider {
  async authenticate() {
    // after authentication u return to admin
     window.location.href = '/api/auth/signin/google?callbackUrl=/admin';// NextAuth sign-in page
  }

  async getUser() {
    // sees if theres a user
    const res = await fetch('/api/auth/session');

    if (!res.ok) {
      // await this._handleExpiredSession(); // logout and redirect
      return null;
    }

    const session = await res.json();

    return session?.user || null;
  }

  async getToken() {

    const res = await fetch('/api/auth/session');

  if (!res.ok) {
    // await this._handleExpiredSession();
    return null;
  }

  const session = await res.json();
  const token = session?.id_token;

  if (!token) {
    // await this._handleExpiredSession();
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      console.warn('[Auth] Token expired');
      // await this._handleExpiredSession();
      return null;
    }
  } catch (err) {
    console.error('[Auth] Failed to decode token:', err);
    // await this._handleExpiredSession();
    return null;
  }

  return { id_token: token };

  }

  async logout() {
      await signOut({ });
  }
    async authorize() {
    const res = await fetch("/api/auth/session");

    if (!res.ok) {
      // await this._handleExpiredSession();
      return false;
    }

    const session = await res.json();
    const authorized = !!session?.user;

    // if (!authorized) {
    //   await this._handleExpiredSession();
    // }
    
    return authorized;
  }

   async _handleExpiredSession() {
    await signOut({callbackUrl: '/api/auth/signin/google?callbackUrl=/admin' }); // Clear local session first
  }

}
