import { changePassword } from "@/app/actions/profile";
import { requireCurrentUser } from "@/lib/currentUser";

export default async function editProfilePage(){

    const user = await requireCurrentUser();

    return(
        <main className="p-8">
            <div> {/* Header */}
                <h1 className="text-2xl font-bold">Change Password</h1>
                
            </div>
            <form action={changePassword}>
                {/* Add ability to change avatar, favourite games and others later */}
                <div className="">
                    <label>Current Password:  </label>
                    <input 
                        type="password"
                        name="oldPassword"
                        className="mt-3 mt-1 w-50 rounded border p-0.5"
                    />
                </div>
                <div className="">
                    <label>New Password:  </label>
                    <input 
                        type="password"
                        name="newPassword"
                        className="mt-3 mt-1 w-50 rounded border p-0.5"
                    />
                </div>
                <button type="submit" className="text-sm text-gray-500 underline cursor-pointer">Submit</button>
            </form>


        </main>

    )


}