// /pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// --- your refresh logic ---
async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const refreshed = await response.json();
    if (!response.ok) throw refreshed;
  
    return {
      ...token,
      accessToken: refreshed.access_token,
      id_token: refreshed.id_token ?? token.id_token, // keep or replace
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: token.refreshToken, // reuse existing refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent", // <-- forces new refresh_token
    },
  },
})
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Initial login
      if (account) {
        token.accessToken = account.access_token;
        token.id_token = account.id_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;

        return token;
      }

      // If access token still valid, just return it
      if (Date.now() < token.accessTokenExpires) {
        
        return token;
      }

      return await refreshAccessToken(token);

      // Otherwise refresh it
      
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.id_token = token.id_token;
      return session;
    },
  },
});