"use client";

import { useRouter } from "next/navigation";

export default function BackButton(){
    const router = useRouter();

    return(
        
        <button
            type="button"
            onClick={() => {
                router.back();
                setTimeout(() => router.refresh(), 0) //force refresh on page its going back to
            }}
            className="text-sm underline cursor-pointer"       
        >
            Back
        </button>
    );
}