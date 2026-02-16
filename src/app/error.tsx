"use client"

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
    error, //thrown error object
    reset, //re-rendering
}: {
    error: Error & {digest?: string}; //Attach digest
    reset: () => void; //retry function
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="p-8">
            <div className="mx-auto max-w-xl rounded border p-6">
                <h1 className="text-2xl font-bold">Something went wrong</h1>

                <p className="mt-2 text-sm text-gray-600">
                    try again, or go back to a safe page.
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => reset()} //re-render the route
                        className="rounded border px-3 py-2 text-sm cursor-pointer"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="rounded border px-3 py-2 text-sm"    
                    >
                        Home
                    </Link>
                </div>
                <div className="mt-6 text-xs text-gray-500 break-words">
                    {error.message}
                </div>
            </div>
        </main>
    );
}