// This file defines a dynamic page shown at:
// http://localhost:3000/profile/<username>

// Example URLs:
// /profile/testuser  -> params.username = "testuser"
// /profile/wezi      -> params.username = "wezi"

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params; 
  // Next.js provides "params" automatically for dynamic routes.
  // Because the folder is named [username], params.username exists.
  return (
    <main className="p-8">
      {/* Show the username from the URL */}
      <h1 className="text-2xl font-bold">@{username}</h1>

      <p className="mt-2 text-gray-500">
        Public profile page (lists + reviews).
      </p>
    </main>
  );
}