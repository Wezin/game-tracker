"use client";

import { useActionState } from "react"; 
import { addGameToLibrary } from "@/app/actions/library"; //import addGameToLibrary function to be called later
import BackButton from "@/app/games/BackButton";

const initialState = {ok: true, error: null as string | null}; //initial state before submit

export default function AddGamePage() { //Create page
    const [state, formAction, isPending] = useActionState(addGameToLibrary, initialState);

    return( //Page details
        <main className="p-8"> {/* Page container padded*/}
            <div>
                <h1 className="text-2xl font-bold">Add a Game</h1> {/* Page Title */}
                <BackButton/>
            </div>
            

            <form action={formAction} className="mt-6 space-y-4 max-w-md"> {/*Send form data to addGameLibrary function*/}
                <div> {/* Title input details */}
                    <label className="block text-sm font-medium">Title:</label> {/* TItle field label*/}
                    <input 
                        name="title" //Store user input into 
                        placeholder="Elden Ring" //While nothing is types, elden ring is there an example
                        className="mt-1 w-full rounded border p-2" //Styling
                        required //title required 
                    /> 
                    {state.error && (//if error occurs
                        <p className="mt-2 text-sm text-red-600">{state.error} </p> //Display error message
                    )}
                </div>

                <div> {/* Platform input details */}
                    <label className="block text-sm font-medium">Platform:</label>
                    <input
                        name="platform"
                        placeholder="PS5"
                        className="mt-1 w-full rounded border p-2"
                    />
                </div>

                <div> {/* Status select details */}
                    <label className="block text-sm font-medium">Status:</label>
                    <select 
                        name="status"
                        className="mt-1 w-full rounded border p-2"
                        defaultValue="BACKLOG" //set default option to BACKLOG
                    >   {/* Drop down options */}
                        <option value="BACKLOG">Backlog</option>
                        <option value="PLAYING">Playing</option>
                        <option value="FINISHED">Finished</option>
                        <option value="DROPPED">Dropped</option>
                    </select>
                </div>
                <button className="rounded bg-black px-4 py-2 text-white" disabled={isPending}> 
                {isPending ? "Adding..." : "Add To Library"}  {/* Shows loading text while submitting */}
                </button> {/* Submit form button */}
            </form>
        </main>
    );
}