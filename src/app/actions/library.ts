"use server"; // Marks this files exproted functions as Server Actions (Run on server, not browser)

import { prisma } from "@/lib/prisma"; //import Prisma client so we can talk to Postgres
import { GameStatus } from "@prisma/client" //import statuses from db
import { redirect } from "next/navigation"; // Redirects the uiser to another page after certain action finishes
import {randomUUID} from "crypto" //built in node fucntion to generate unique IDs

type AddGameState = {ok: boolean; error: string | null}; //Defines the state your form receives back from the actions

const DEMO_EMAIL = "demo@gametracker.local"; //temp fake login 
const DEMO_USERNAME = "demo"; // Temporary username for the demo user

export async function addGameToLibrary(prevState: AddGameState, formData: FormData): Promise<AddGameState>{ //Runs when a form submits with actions
    const title = String(formData.get("title") || "").trim(); //Get title from form and remove extra spaces
    const platform = String(formData.get("platform") || "").trim(); //Get platform form the form
    const rawStatus = String(formData.get("status") || "BACKLOG").trim(); //Gets status typed from user, defaults to BACKLOG if empty
    if (!title) { //if not title
        return {ok: false, error: "Title is required"}; //return error instead of throwing
    }
    const status: GameStatus = //Declare status as the enum type prisma expects
        rawStatus in GameStatus //Check if rawStatus matches a GameStatus
            ? (GameStatus as any)[rawStatus] //Convert string to enum value if does
            : GameStatus.BACKLOG; //if invalid, default to BACKLOG enum type

    

    const user = await prisma.user.upsert({ //Check if demo user is already created adn store it in use
        where: { email: DEMO_EMAIL }, //look for DEMO_EMAIL in database
        update: {}, //if user email found, dont create new user (don't need to update either)
        create: { email: DEMO_EMAIL, username: DEMO_USERNAME }, //if user email not found, create new user
    });

    const existingGame = await prisma.game.findFirst({ //check game database for game that has the same title as submitted in the form
        where: {title: title}, //Find row with game title of title variable
    });

    const game = existingGame ?? ( //if game is found, reuse it, otherwise create the game
        await prisma.game.create({ //create new game row (insert new game into game table)
            data: { //Data for the new game row
                id: randomUUID(), //generate unique ID for game
                title: title, // assign title to title.
                coverUrl: null, //set cover art to null for now
            },
        })
    );

    await prisma.userGame.upsert({
        where: { userId_gameId: { userId: user.id, gameId: game.id}}, //search for game with specifed user id and game id
        update: { status, platform: platform || null}, //if it exists, update the status and platform
        create: { //if it doesnt exist, create it
            userId: user.id,
            gameId: game.id,
            status: status,
            platform: platform,
            hoursPlayed: 0,
            progressPct: 0, 
        }, 
    });

    redirect("/library"); //send the user back to the librarby page after inserting
    
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

    //Update fields
    const result = await prisma.userGame.updateMany({ //Update many instances of userGame
        where: {id}, //Update specifc to this ID
        data: { status, hoursPlayed, progressPct }, //Update the following fields
    });

    if (result.count === 0){ //if not rows were updated, ERROR
        throw new  Error("Library entry not found")
    }

    redirect("/library"); //send the user back to the librarby page after inserting
}

//delete game from library function later

