"use server";

import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
    // Implement your sign-up logic here, e.g., save to database
    const result = await auth.api.signUpEmail({
        body: {
            email, password, name, callbackURL: "/dashboard"
        }
    });
    console.log("Signing up user:", { email, password, name });
    return result;
};

export const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
        body: {
            email,
            password,
            callbackURL: "/dashboard",
        }
    });
    console.log("Signing up user:", { email, password });
    return result;
};

export const signOut = async () => {
    // Implement your sign-up logic here, e.g., save to database
    const result = await auth.api.signOut({ headers: await headers() });
    console.log("Sigouting out user");
    return result;
};

export const forgotPassword = async ( value:any, ) => {
    console.log("Requesting password reset for:", value.email);
    try {
        const result = await auth.api.requestPasswordReset({
            body: {
                email: value.email,
            },
        });
        console.log("Password reset requested:", result);
        return result;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};
