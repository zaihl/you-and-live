'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"

export async function deleteAccount() {
    const { userId } = auth()
    if (!userId) {
        redirect('/', RedirectType.replace)
    }
    const res = await clerkClient.users.deleteUser(userId)
    revalidatePath('/')
    revalidatePath('/dashboard')
    redirect('/delete', RedirectType.replace)
}