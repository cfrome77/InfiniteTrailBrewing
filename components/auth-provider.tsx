"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type User = typeof authClient.$Infer.Session.user;

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthClientWrapper setUser={setUser}>
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    </AuthClientWrapper>
  );
}

function AuthClientWrapper({ children, setUser }: { children: React.ReactNode, setUser: (user: User | null) => void }) {
    const session = authClient.useSession();

    useEffect(() => {
        if (session.data) {
            setUser(session.data.user);
        } else {
            setUser(null);
        }
    }, [session.data, setUser]);

    return <>{children}</>;
}

export const useAuth = () => useContext(AuthContext);
