import { auth } from "./auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// const DEMO_EMAIL = "demo@gametracker.local"; //store demo email

// export async function getCurrentUser(){ //Get current user
//     const user = await prisma.user.findUnique({
//         where: { email: DEMO_EMAIL },
//     });

//     if(!user){ //if user not found, throw
//         throw new Error("Demo user not found");
//     }

//     return user; //return the current user
// }

export async function getCurrentUser(){ //get user based on session and user db
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session?.user.id) return null; // no cookie / invalid cookie = not logged in

    const user = await prisma.user.findUnique({ //get user from db 
        where: { id: session.user.id },
    });

    return user; 
}

export async function requireCurrentUser(){
    const user = await getCurrentUser(); //get user

    if(!user) redirect("/sign-in"); //if no user, sign in

    return user; //return user if signed in
}