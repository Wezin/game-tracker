"use server";

import { auth } from "@/lib/auth"; //For better auth authentification functions
import { APIError } from "better-auth";
import { headers } from "next/headers"; //
import { redirect } from "next/navigation"; //redirects


//Sign up
export async function signUpAction(formData: FormData){
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    if(!name || !password || !email) redirect("/sign-up?error-missing_fields");

    try { //create user
        await auth.api.signUpEmail({
            body: {email, password, name},
        });
        console.log("Made proper account");
    } catch { //if creating user causes error
        console.log("unknown signup error");
        redirect("/sign-up?error-signup_failed");
    }
    redirect("/home"); //send to library page is signup works
}

//Sign in
export async function signInAction(formData: FormData){
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try{ //user sign in
        await auth.api.signInEmail({
            body: {email, password},
            headers: await headers(),
        });

        console.log("Succ signin");
    } catch { //if sign in error
        console.log("inproper signin");
        redirect("/sign-up?error-signup_failed"); //signup error path
    }
    redirect("/home"); //send to library page is signup works
}

//Sign out
export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });

    redirect("/home");
}