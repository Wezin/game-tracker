"use server"; 

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/currentUser";

//Create custom list
export async function createList(formData: FormData){
    const name = String(formData.get("name") ?? "").trim()
    const description = String(formData.get("description") || "").trim()
    const isPublicRaw = String(formData.get("isPublic")).trim();
    const isPublic = isPublicRaw === "true"

    if(!name){
        throw new Error("Invalid  title")
    }

    const user = await requireCurrentUser();

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

    const user = await requireCurrentUser(); //get current user

    const list = await prisma.list.findFirst({ //Assign list based on userid and listid
        where: { id: listId, userId: user.id }
    });

    if(!list){ //if not list throw error
        throw new Error("List not found");
    }

    //TODO: DO POSITION SUTFF AFTER AUTH AND DATABASE API
    // //Get list items from list
    // const currentListItems = await prisma.list.findUnique({
    //     where: {id: listId, userId: user.id},
    //     include: {items: true},
    // })

    // //Get length position + 1
    // const count = Number(currentListItems?.items.length) + 1;
    
    
    const temp = await prisma.listItem.create({ //insert game into list
        data: {
            listId,
            gameId,
        },
    });  

    redirect(`/lists/${listId}/add`); //After form is filled i dont need it to redirect anywhere for now
}

//Delete game from list
export async function removeGameFromList(formData: FormData){
    const listId = String(formData.get("listId") ?? "").trim();
    const gameId = String(formData.get("gameId") ?? "").trim();

    if(!listId || !gameId){
        throw new Error("Invalid listId or gameId");
    }

    const user = await requireCurrentUser(); //get current user

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
    

    const user = await requireCurrentUser();

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