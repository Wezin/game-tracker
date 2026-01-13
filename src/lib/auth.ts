import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; //Allows betterauth to store users/sessions in prisma
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
    database: prismaAdapter(prisma, { //Connect to database through adapter
        provider: "postgresql", //Database provider
    }),
    emailAndPassword: { //Login type, email and password
        enabled: true,
    },

    plugins: [
        nextCookies(),
    ]
});

