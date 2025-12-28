//Library page
//URL: http://localhot:3000/library

export default function Library() {

    return (
        <main className="p-8">
            {/* Big header */}
            <h1 className="text-2xl font-bold">My Library</h1>

            {/* Smaller grey text below the header */}
            <p className="mt-2 text-gray-500">
                Your saved games will appear here.
                
            </p>
        </main>
    );
}