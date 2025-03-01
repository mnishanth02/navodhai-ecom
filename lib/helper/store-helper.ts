import "server-only"

import { cache } from 'react'
import { auth } from "@/auth"
import { getStoreByIdQuery, getStoreByUserIdQuery } from "@/lib/data-access/store-quries"
import { redirect } from "next/navigation"

// Cache the store validation for 60 seconds
export const validateUserStore = cache(async () => {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/sign-in")
    }

    const response = await getStoreByUserIdQuery(session.user.id)
    if (response.success) {
        return { store: response.data, userId: session.user.id }
    }

    return { store: null, userId: session.user.id }
})

// Cache the specific store validation for 60 seconds
export const validateSpecificStore = cache(async (storeId: string) => {
    const { userId } = await validateUserStore()

    const store = await getStoreByIdQuery(storeId, userId)
    console.log(store);

    if (!store.success) {
        redirect("/")
    }

    return store.data
})