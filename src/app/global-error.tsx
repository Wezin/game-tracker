"use client";
import "./globals.css"

export default function GlobalError({ error, reset }: {error: Error; reset: ()=> void}) {
    
    return (
        <html lang="en">
            <body>
                <main className="p-8">
                    <div className="mx-auto max-w-xl rounded border p-6">
                        <h1 className="text-2xl font-bold">
                            Something went wrong
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Please try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => reset()} //re-render the route
                            className="rounded border px-3 py-2 text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </body>
        </html>
    );
}