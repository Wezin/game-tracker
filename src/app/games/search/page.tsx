"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

//shape game result data
type igdbSearchResult ={
    id: number;
    name: string;
    firstReleaseDate: number | null;
    coverUrl: string | null;
}

export default function GameSearchPage() {

    //query is what the user typed, setQuery rerenders the page accordingly
    const [query, setQuery] = useState("");

    //Search results | Array of igdbSearchResult objects
    const [games, setGames] = useState<igdbSearchResult[]>([])

    //loading to track if we're waiting on a the server
    const [loading, setLoading] = useState(false);

    //For error messages if something fails
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        //trim search results
        const trimmed = query.trim();

        //if user has typed less then 2 characters
        if(trimmed.length < 2){
            //Clear the search result games to nothing
            setGames([]);
            //Clear errors
            setError(null); 
            return;
        }

        //Debounce (delay the effects of function after user input) 
        const timeoutId = window.setTimeout(async () => {

            try {  

                //Start loading before fetch
                setLoading(true);

                //Clear errors
                setError(null);

                //Url to route.ts with user search (trimmed)
                const url = `/api/igdb/search?q=${encodeURIComponent(trimmed)}`;

                //Fetch to the route file which handles the server side code to return our JSON gamedata   
                const request = await fetch(url);

                //If something is wrong, print out error status
                if(!request.ok) throw new Error(`Search failed (status: ${request.status})`);

                //Get game json data to shape it
                const data = (await request.json()) as {games: igdbSearchResult[]};

                //Put results into state
                setGames(data.games);

            } catch(error) {
                //print error message
                const message = error instanceof Error ? error.message : "Unknown Error";
                
                //Store error
                setError(message);
            } finally {

                //Stop loading
                setLoading(false);
            }
            //400ms debounce delay
        }, 400);

        //If query changes within the debounce delay finsihes(400ms), cancel the previous schedueled fetch 
        return () => window.clearTimeout(timeoutId);

        //query changes trigger useEffect
    }, [query]);

    return (
        <main className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">Search Games (IGDB)</h1> {/* Page title */}

            <div className="mt-4"> {/* Search box */}
                <label className="block text-sm font-medium">Game name</label>
                <input 
                    value={query} //Store input into query
                    onChange={(e) => setQuery(e.target.value)} //update state when user types
                    placeholder="Elden Ring"
                    className="mt-1 w-full rounded border px-3 py-2" 
                />
                <p className="mt-1 text-sm text-gray-500">Type at least 2 characters.</p> {/*Let user know to type at least 2 characters*/}
            </div>

            {loading && ( //Show "Loading" while requesting
                <p className="mt-4 text-sm text-gray-600">Searching</p>
            )}

            {error && ( ////Display error message if error occurs
                <p className="mt-4 text-sm text-gray-600">{error}</p>  
            )}

            <ul className="mt-6 space-y-3"> {/* List results */}
                {games.map((g) => (
                    <li key={g.id} className="rounded border p-4 flex gap-4 items-center">
                        
                        {g.coverUrl ? ( //if game has image, display it, else placeholder cover
                            <img src={g.coverUrl} alt={g.name} className="w-12 h-16 object-cover rounded"/>
                        ) : (
                            <div className="w-12 h-16 bg-gray-200 rounded"/>
                        )}

                        <div className="flex-1"> {/* Text Details */}
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-sm text-gray-600">
                                {g.firstReleaseDate ? new Date((g.firstReleaseDate < 10_000_000_000 ? g.firstReleaseDate * 1000 : g.firstReleaseDate)).getUTCFullYear() : null}
                            </div>
                        </div>
                        <Link className="rounded border px-3 py-y text-sm cursor-pointer" href={`/games/${g.id}`}>View</Link> {/* View game */}
                    </li>
                ))}
            </ul>
        </main>
    );
}