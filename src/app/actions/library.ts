"use server"; // Marks this files exproted functions as Server Actions (Run on server, not browser)

import { prisma } from "@/lib/prisma"; //import Prisma client so we can talk to Postgres
import { GameStatus, ActivityType } from "@prisma/client"; //import statuses from db
import { redirect } from "next/navigation"; // Redirects the uiser to another page after certain action finishes
import { requireCurrentUser } from "@/lib/currentUser";
import { getGameByIgdbId } from "@/lib/igdb";
import { statusCodes } from "better-auth";

type AddGameState = {ok: boolean; error: string | null}; //Defines the state your form receives back from the actions

//Add game to library
export async function addGameToLibrary(formData: FormData){
    const strIgdbId = String(formData.get("strIgdbId") ?? "").trim();
    const strGameStatus = String(formData.get("status") ?? "").trim();

    //Error check
    if(!strIgdbId ) throw new Error("Invalid id");
    if(!(strGameStatus in GameStatus)) throw new Error("Invalid game status");
    

    //get user
    const user = await requireCurrentUser();

    //Turn igdbId to number
    const igdbId = Number(strIgdbId);

    //Assign status
    const status: GameStatus = (GameStatus as any)[strGameStatus];
    //const activityChangeType: ActivityType = (ActivityType as any);

    //Chekc if game is in db
    const game = await prisma.game.findUnique({
        where: { igdbId: igdbId },
    });

    //Store potential game
    let ensuredGame = game;
    let newGameToLibrary = "";

    //If game doesnt exist, make it
    if(!ensuredGame){
        const igdbGame = await getGameByIgdbId(igdbId); //fetch game from igdb
        if(!igdbGame) throw new Error("Igdb game not found"); //if game is not found, error

        //Create game
        ensuredGame = await prisma.game.create({
            data: {
                igdbId,
                title: igdbGame.title,
                coverUrl: igdbGame.coverUrl ?? null,
                description: igdbGame.description ?? null,
                releaseDate: igdbGame.releaseDate ?? null,
                developer: igdbGame.developer ?? null,
            },
        });
    }

    //Check if 
    const existsInUserGame = await prisma.userGame.findUnique({
        where: { userId_gameId: { userId: user.id, gameId: ensuredGame.id}},
    })

    //If game is not in users library, create it
    if(!existsInUserGame){
        await prisma.userGame.create({
            data: {
                userId: user.id,
                gameId: ensuredGame.id,
                status,
            },
        });
        //New to library activity
        newGameToLibrary = "LIBRARY_ADD";
    }else{ //if game is already in users library
        await prisma.userGame.update({
            where: {userId_gameId: {userId: user.id, gameId: ensuredGame.id}},
            data: {status},
        });
        //Activity for game already in users library
        newGameToLibrary = "STATUS_CHANGE";
    }
    


    //Determine type of activity update
    //const activityChangeType = newGameToLibrary as ActivityType;

    //Track activity
    await prisma.activity.create({
        data: {
            userId: user.id,
            gameId: ensuredGame.id,
            type: newGameToLibrary as ActivityType,
            status: status,
        },
    });

     redirect(`/games/${igdbId}`);
}


//Update userGame

export async function updateUserGame(formData: FormData) {
    //Get form data
    const id = String(formData.get("userGameId") || "").trim();
    const rawStatus = String(formData.get("status") || "BACKLOG").trim();
    const hoursPlayed = Number(String(formData.get("hoursPlayed") || "0").trim());
    const progressPct = Number(String(formData.get("progressPct") || "0").trim());
    const status: GameStatus = //set status variable to Gamestatus
        rawStatus in GameStatus //if rawstatus variable is in GameStatus table
        ? (GameStatus as any)[rawStatus] //Take element in game status that matches rawstatus(key)
        : GameStatus.BACKLOG; 

    //Check if inputs are valid
    if(!id){
        throw new Error("Missing userGameId");
    }
    if(!Number.isFinite(hoursPlayed) || hoursPlayed < 0){
        throw new Error("Invalid hoursPlayed Number")
    }
    if(!Number.isFinite(progressPct) || progressPct > 100 || progressPct < 0){
        
        throw new Error("Invalid progressPct Number")
    }

    const user = await requireCurrentUser();


    //Update fields
    const result = await prisma.userGame.updateMany({ //Update many instances of userGame
        where: {id, userId: user.id}, //Update specifc to this ID
        data: { status, hoursPlayed, progressPct }, //Update the following fields
    });

    if (result.count === 0){ //if not rows were updated, ERROR
        throw new  Error("Library entry not found")
    }

    redirect("/library"); //send the user back to the librarby page after inserting
}

//delete game from library function later
export async function deleteGameFromLibrary(formData: FormData){
    const gameid = String(formData.get("toBeDeleted")).trim();
    const igdbId = String(formData.get("igdbGameId")).trim();

    const user = await requireCurrentUser();

    const game = await prisma.userGame.findFirst({
        where: {userId: user.id, gameId: gameid},
    });

    if(!game) throw new Error("Game not found");


    //Delete from everything
    await prisma.userGame.deleteMany({
        where: {userId: user.id, gameId: gameid},
    });

    redirect(`/games/${igdbId}`);
}

