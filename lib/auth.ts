import { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth.js configuration for JHR Photography Admin
 * Uses AWS Cognito in production, Credentials provider for development
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider for development/testing
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@jhr-photography.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple password check against EDITOR_PASSWORD env var
        if (
          credentials?.email === 'admin@jhr-photography.com' &&
          credentials?.password === process.env.EDITOR_PASSWORD
        ) {
          return {
            id: '1',
            name: 'JHR Admin',
            email: 'admin@jhr-photography.com',
          };
        }
        return null;
      },
    }),
    // Cognito provider for production (when configured)
    ...(process.env.COGNITO_CLIENT_ID
      ? [
          CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
            issuer: process.env.COGNITO_ISSUER,
          }),
        ]
      : []),
  ],

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  callbacks: {
    async session({ session, token }) {
      // Include user info from token in session
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      // Persist user info to token on initial sign in
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
