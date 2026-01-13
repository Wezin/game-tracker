import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/currentUser";

export async function editAccount(formData: FormData){
    const newName = String(formData.get("newName") || "").trim();
    const newEmail = String(formData.get("newEmail") || "").trim();
    const newPassword = String(formData.get("newPassword") || "").trim();
    // const description = String(formData.get("description") || "").trim();

    const user = await requireCurrentUser();
    const usersAccount = await prisma.account.findFirst({
        where: {userId: user.id},
        select: {password: true}, 
    })
    const password = String(usersAccount?.password)

    if(newEmail !== ""){ //check if email has an @ and . (betterauth might do that automatically)
        await auth.api.changeEmail({
            body: {newEmail},
        });
    } 

    if(newPassword !== ""){
        await auth.api.changePassword({
            body: {
                newPassword: newPassword,
                currentPassword: password,
            }
        });
    }
    if(newName !== ""){
        await prisma.user.update({
            where: {id: user.id},
            data: {name: newName},
        });
    }
    redirect("/profile");
}