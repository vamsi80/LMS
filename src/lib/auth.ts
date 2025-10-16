
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { nextCookies } from "better-auth/next-js";
import ForgotPasswordEmail from "@/components/auth/email-form";
// import { sendEmail } from "./email";
import { render } from "@react-email/render";
import { admin } from "better-auth/plugins"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        // sendResetPassword: async ({ user, url}) => {
        //     console.log("Sending password reset email to:", user.email, "with URL:", url);
        //     const htmlContent = await render(
        //         ForgotPasswordEmail({
        //             userEmail: user.email,
        //             userName: user.name,
        //             resetUrl: url,
        //         })
        //     );

        //     await sendEmail({
        //         to: user.email,
        //         subject: "Reset your password",
        //         html: htmlContent,
        //     });
        // },

        sendResetPassword: async ({ user, url }) => {
            console.log("Sending password reset email to:", user.email, "with URL:", url);

            // render returns Promise<string> — await it so htmlContent is a string
            const htmlContent = await render(
                ForgotPasswordEmail({
                    userEmail: user.email,
                    userName: user.name ?? "",
                    resetUrl: url,
                })
            );

            // send email via Resend (htmlContent is now string)
            await resend.emails.send({
                from: "LMS <onboarding@resend.dev>",
                to: user.email,
                subject: "Reset your password",
                html: htmlContent,
            });
        },

    },

    plugins: [nextCookies(), admin()],
});
