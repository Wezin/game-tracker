import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

export default async function signUpDisplay(){
    const user = await getCurrentUser();
    if(user) redirect("/library");


    return(
        <main className="p-8">
            <div className="center-container"> {/* Header */}
                <h1 className="text-4xl font-bold"> Game's Library</h1>
                <p className="mt-1 text-1xl text-gray-300 font-medium">Welcome Back</p>
            </div>
            <form action={signInAction} className="">
                <div className=""> {/* Email */}
                    <label className="text-2xl font-bold">Email:  </label>
                    <input 
                        type="text"
                        name="email"
                        placeholder="gamelibrary@example.com"
                        className="mt-5 w-60 rounded border p-1" 
                        required
                    />
                </div>
                
                <div> {/* Password */}
                    <label className="text-2xl font-bold">Password:  </label>
                    <input 
                        type="password"
                        name="password"
                        className="mt-5 w-60 rounded border p-1" 
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="text-sm text-gray-500 underline cursor-pointer"
                >
                    Sign-In
                </button>
                <div className="mt-10"> {/* Sign up button */}
                    <p className="text-sm">Don't have an account?</p>
                    <Link className="text-sm text-gray-500 underline cursor-pointer" href={"/sign-up"}>sign-up</Link>
                </div>
            </form>
        </main>
    )
}