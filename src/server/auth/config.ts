import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    accessToken: string;
    error?: "RefreshTokenError";
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}

const tokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          access_type: "offline", // Google requires "offline" access_type to provide a `refresh_token`
          prompt: "consent",
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/youtube.readonly",
          ].join(" "),
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Google provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    signIn: ({ account, profile }) => {
      if (account?.provider === "google" && profile?.email_verified) {
        return true;
      }

      return false;
    },

    /**
     * @see: https://authjs.dev/guides/refresh-token-rotation
     */
    jwt: async ({ token, account }) => {
      // First-time login, save the `access_token`, its expiry and the `refresh_token`
      if (account) {
        console.debug("First time login");
        return {
          ...token,
          access_token: account.access_token ?? "",
          expires_at: account.expires_at ?? 0,
          refresh_token: account.refresh_token,
        };
      }

      // Subsequent logins, but the `access_token` is still valid
      if (Date.now() < token.expires_at * 1000) {
        console.debug("Access token is still valid");
        return token;
      }

      // Subsequent logins, but the `access_token` has expired, try to refresh it
      if (!token.refresh_token) {
        console.debug("No refresh token available");
        return {
          ...token,
          error: "RefreshTokenError",
        };
      }

      try {
        console.debug("Refreshing access token");
        // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
        // at their `/.well-known/openid-configuration` endpoint.
        // i.e. https://accounts.google.com/.well-known/openid-configuration
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: env.AUTH_GOOGLE_ID,
            client_secret: env.AUTH_GOOGLE_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          }),
        });

        const tokensOrError = (await response.json()) as unknown;

        if (!response.ok) throw tokensOrError;

        const newTokens = tokenSchema.parse(tokensOrError);

        return {
          ...token,
          access_token: newTokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          refresh_token: newTokens.refresh_token ?? token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "RefreshTokenError",
        };
      }
    },
    session: ({ session, token }) => {
      return {
        ...session,
        accessToken: token.access_token,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
} satisfies NextAuthConfig;
