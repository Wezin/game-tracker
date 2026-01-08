"use server"; 

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

//Create custom list
export async function createList(formData: FormData){
    const name = String(formData.get("name") ?? "").trim()
    const description = String(formData.get("description") || "").trim()
    const isPublicRaw = String(formData.get("isPublic")).trim();
    const isPublic = isPublicRaw === "true"

    if(!name){
        throw new Error("Invalid  title")
    }

    const user = await getCurrentUser();

    const newList = await prisma.list.create({
        data: {
            userId: user.id,
            name: name,
            descirption: description || null,
            isPublic: isPublic,
        }, 
    });    
    redirect(`/lists/${newList.id}/add`);
}

//Add Game to list
export async function addGameToList(formData: FormData){
    const listId = String(formData.get("listId") ?? "").trim();
    const gameId = String(formData.get("gameId") ?? "").trim();

    if(!listId || !gameId){
        throw new Error("Invalid listId or gameId");
    }

    const user = await getCurrentUser(); //get current user

    const list = await prisma.list.findFirst({ //Assign list based on userid and listid
        where: { id: listId, userId: user.id }
    });

    if(!list){ //if not list throw error
        throw new Error("List not found");
    }

    const temp = await prisma.listItem.create({ //insert game into list
        data: {
            listId,
            gameId,
        },
    });  

    console.log(temp.gameId + " was added")

    redirect(`/lists/${listId}/add`); //After form is filled i dont need it to redirect anywhere for now
}

//Delete game from list
export async function removeGameFromList(formData: FormData){
    const listId = String(formData.get("listId") ?? "").trim();
    const gameId = String(formData.get("gameId") ?? "").trim();

    if(!listId || !gameId){
        throw new Error("Invalid listId or gameId");
    }

    const user = await getCurrentUser(); //get current user

    const list = await prisma.list.findFirst({ //Assign list based on userid and listid
        where: { id: listId, userId: user.id }
    });

    if(!list){ //if not list throw error
        throw new Error("List not found");
    }

    await prisma.listItem.deleteMany({
        where: { listId, gameId}
    })

    redirect(`/lists/${listId}`);
}

//Delete list
export async function removeList(formData: FormData){
    const listId = String(formData.get("listId")).trim(); 
    

    const user = await getCurrentUser();

    //Get list
    const listToBeDeleted = await prisma.list.findFirst({
        where: {id: listId, userId: user.id},
    })

    //Run multiple db operations
    await prisma.$transaction([
        //Deletes items is so to be deleted list
        prisma.listItem.deleteMany({
            where: { listId: listToBeDeleted?.id },
        }),

        //Delete list itself
        prisma.list.deleteMany({
            where: {id: listToBeDeleted?.id, userId: user.id},
        })
    ])

    redirect("/lists");

}