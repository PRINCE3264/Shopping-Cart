// // contexts/AuthContext.tsx
// "use client";
// import React, { createContext, useState, useEffect } from "react";

// type AuthCtx = {
//   accessToken: string | null;
//   user: { id: string; email: string } | null;
//   setAuth: (token: string | null, user?: any) => void;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthCtx | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     // optional: try to refresh on mount
//     (async () => {
//       try {
//         const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
//         if (res.ok) {
//           const data = await res.json();
//           setAccessToken(data.accessToken);
//         }
//       } catch {}
//     })();
//   }, []);

//   function setAuth(token: string | null, u?: any) { setAccessToken(token); if (u) setUser(u); }
//   function logout() { setAccessToken(null); setUser(null); fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(()=>{}); }

//   return <AuthContext.Provider value={{ accessToken, user, setAuth, logout }}>{children}</AuthContext.Provider>;
// }
