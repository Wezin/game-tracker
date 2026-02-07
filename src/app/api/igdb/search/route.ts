import { NextResponse } from "next/server";
import { searchGames } from "@/lib/igdb";

export async function GET(req: Request){
    //Store request URL (URL fromed when searhcing game like elden ring)
    const url = new URL(req.url);
    //Get search term from URL (essneitall part of the game name)
    const q = url.searchParams.get("q") ?? ""; 

    //If nothing in q return error
    if(q.trim().length === 0) {
        return NextResponse.json({error: "Missing q"}, {status: 400});
    }

    //Call searchGame to search for the game
    const games = await searchGames(q.trim());
    return NextResponse.json({ games }); 
}