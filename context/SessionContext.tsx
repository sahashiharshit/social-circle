"use client";

import type { ClientSession } from "@/types/Session";
import { createContext, useContext } from "react";

const SessionContext = createContext<ClientSession>(null);

export const SessionProvider =({

    value,
    children,
}:{
    value:ClientSession;
    children:React.ReactNode;
})=>{
    return(
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

export function useSession(){
    return useContext(SessionContext);
}