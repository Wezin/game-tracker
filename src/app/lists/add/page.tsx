"user client";
import { createList } from "@/app/actions/lists";
import Link from "next/link";

export default function addListForm(){

    return(
        <main className="p-8">
            <div className="flex items-center justify-between"> {/* header */}
                <h1 className="text-2xl font-bold">Create List</h1>
                <Link className="text-sm text-gray-500 underline" href="/lists">Back</Link> {/* Back button */}            
            </div>

            <form action={createList} className="mt-6 space-y-4 max-w-md">
                <div> {/* List name */}
                    <label className="block text-sm font-medium">List Name:</label>
                    <input  
                        name="name"
                        placeholder="Favourite Action Games"
                        className="mt-1 w-full rounded border p-2"
                        required
                    />
                </div>
                <div> {/* List description */}
                    <label className="block text-sm font-medium">Description:</label>
                    <textarea 
                        name="description"
                        placeholder="Games I believe have the best action"
                        className="mt-1 w-full rounded border p-2"
                        rows={3}
                    />
                </div> {/* Public or Private list */}
                <fieldset className="flex items-center gap-6"> {/* Private or Public list */}
                    <legend className="text-sm font-medium">Visibility:</legend>
                    <label className="flex item-center gap-2 text-sm">
                    <input 
                        type="radio"
                        value={"true"}
                        name="isPublic"
                        required
                    />
                    Public</label>
                    <label className="flex item-center gap-2 text-sm"> 
                    <input 
                        type="radio"
                        value={"false"}
                        name="isPublic" 
                        />
                    Private</label> 
                </fieldset>
                <button className="rounded bg-black px-4 py-2 text-white">Create List</button>
            </form>
        </main>

    );
}