import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import "dotenv/config";
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    experimental: { joins: true },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Verify your Email",
                html: `<p>Click <a href="${url}"> here </a> to verify your email.</p>`,
            });
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    plugins: [nextCookies()],

})
