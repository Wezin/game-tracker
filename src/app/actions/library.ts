"use server"; // Marks this files exproted functions as Server Actions (Run on server, not browser)

import { prisma } from "@/lib/prisma"; //import Prisma client so we can talk to Postgres
console.log("TESTYESTES");
import { GameStatus } from "@prisma/client"; //import statuses from db
import { redirect } from "next/navigation"; // Redirects the uiser to another page after certain action finishes
import { requireCurrentUser } from "@/lib/currentUser";
import { getGameByIgdbId } from "@/lib/igdb";

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

    //Chekc if game is in db
    const game = await prisma.game.findUnique({
        where: { igdbId: igdbId },
    });

    //Store potential game
    let ensuredGame = game; 

    //If game doesnt exists, make it
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

    //Update status of user's game, if not a userGame, create
    const updateGameStatus = await prisma.userGame.upsert({
        where: { userId_gameId: { userId: user.id, gameId: ensuredGame.id}},
        update: { status: status },
        create: {
            userId: user.id,
            gameId: ensuredGame.id,
            status,
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

