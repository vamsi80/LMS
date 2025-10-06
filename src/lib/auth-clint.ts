import { createAuthClient } from "better-auth/client";

export const auth = createAuthClient({
    baseURL:process.env.BETTER_AUTH_URL
});

export const { signUp, signIn, signOut, requestPasswordReset } = createAuthClient()