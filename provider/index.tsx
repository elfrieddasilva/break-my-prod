"use client"

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DIProvider } from "@/context/DI";

export default function Provider({ children }: { children: React.ReactNode }): React.ReactElement {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <DIProvider>
            {children}
            </DIProvider>
        </QueryClientProvider>
    );
}
