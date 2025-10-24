import "server-only"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

export const requireAdmin = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect('/sign-in')
    }

    if (session.user.role !== 'admin') {
        return redirect('/not-admin')
    }

    return session;
});
