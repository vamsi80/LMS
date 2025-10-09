
import React from "react"

export default function LayoutMain({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main className="container mx-auto min-h-screen px-4 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
