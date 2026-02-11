"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/currentUser";
import { headers } from "next/headers";

export async function editAccount(formData: FormData){
    const newName = String(formData.get("newName") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const gameId = String(formData.get("gameId") || "").trim();
    const rawPosition = String(formData.get("position") || "").trim();
    
    
    //Get user
    const user = await requireCurrentUser();

    //Edit USers Fav Games

    //Make list of users chosen favourite games
    const favs: Array<{ position: number; gameId: string }> = [];


    //Loop throuhg each potential 
    for(let pos = 1; pos <= 5; pos++){
        const gameId = String(formData.get(`fav${pos}GameId`) ?? "").trim();

        //if the form data recived something, push id into favs list
        if(gameId) favs.push({position: pos, gameId});
    }

    //Check if the user wants to add the same game twice
    const unqiueCheck = new Set(favs.map((f) => f.gameId)); //Make set list of fav games (set deletes duplicates)
    //if unique list is not the same size of fav games list, that means fav games has duplicates
    if(unqiueCheck.size !== favs.length) throw new Error("Duplicate favourite Game");


    await prisma.$transaction(async (tx) => {

        //Delete all existing favourite games
        await tx.favouriteGame.deleteMany({
            where: {userId: user.id},
        });

        //Add new fav games
        for(const f of favs){
            await tx.favouriteGame.create({
                data: {
                    userId: user.id,
                    gameId: f.gameId,
                    position: f.position 
                },
            });
        }

        //Editing bio
        if(bio){
            await tx.user.update({
            where: {id: user.id},
            data: {bio}
        })
        }
        //Editing name
        if(newName){
            await tx.user.update({
                where: {id: user.id},
                data: {name: newName},
            });
        }


    })

    redirect("/profile");
}

export async function changePassword(formData: FormData){
    const oldPassword = String(formData.get("oldPassword") || "").trim();
    const newPassword = String(formData.get("newPassword") || "").trim();

    const user = await requireCurrentUser();
    const reqHeaders = await headers();

    if(newPassword){

        if(!oldPassword){ //old password requred for changing password
            redirect("/profile/edit?error=missing_current_password");
        }
        await auth.api.changePassword({
            headers: reqHeaders,
            body: {
                newPassword: newPassword,
                currentPassword: oldPassword,
            }
        });
    }
    redirect("/profile");
}

