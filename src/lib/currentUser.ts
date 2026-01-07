import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@gametracker.local"; //store demo email

export async function getCurrentUser(){ //Get current user
    const user = await prisma.user.findUnique({
        where: { email: DEMO_EMAIL },
    });

    if(!user){ //if user not found, throw
        throw new Error("Demo user not found");
    }

    return user; //return the current user
}