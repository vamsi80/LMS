import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { nextCookies } from "better-auth/next-js";
import ForgotPasswordEmail from "@/components/auth/email-form";
import { sendEmail } from "./email";
import { render } from "@react-email/render";


const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url}) => {
            console.log("Sending password reset email to:", user.email, "with URL:", url);
            const htmlContent = await render(
                ForgotPasswordEmail({
                    userEmail: user.email,
                    userName: user.name,
                    resetUrl: url,
                })
            );

            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: htmlContent,
            });
        },
        onPasswordReset: async ({ user }) => {
            // your logic here
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },

    plugins: [nextCookies()],
});