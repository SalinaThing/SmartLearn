import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

type SessionData = {
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
} | null;

export type SessionContextValue = {
  data: SessionData;
  status: "loading" | "authenticated" | "unauthenticated";
};

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "unauthenticated",
});

let setSessionDispatch: Dispatch<SetStateAction<SessionContextValue>> | null =
  null;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionContextValue>({
    data: null,
    status: "unauthenticated",
  });

  useEffect(() => {
    setSessionDispatch = setSession;
    return () => {
      setSessionDispatch = null;
    };
  }, []);

  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

function loadGoogleScript(): Promise<void> {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { google?: { accounts?: { oauth2?: unknown } } })
      .google?.accounts?.oauth2
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(s);
  });
}

/** opens Google OAuth token flow, then sets session for `Header` → `socialAuth`. */
export async function signIn(provider?: string) {
  if (provider === "google") {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Set VITE_GOOGLE_CLIENT_ID in .env (Google Cloud OAuth Web client).");
      return;
    }
    try {
      await loadGoogleScript();
      const google = (window as unknown as { google: { accounts: { oauth2: {
        initTokenClient: (opts: {
          client_id: string;
          scope: string;
          callback: (r: { access_token?: string; error?: string }) => void;
        }) => { requestAccessToken: () => void };
      } } } }).google;
      await new Promise<void>((resolve) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          callback: async (tokenResponse) => {
            if (tokenResponse.error || !tokenResponse.access_token) {
              resolve();
              return;
            }
            try {
              const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const u = (await r.json()) as {
                email?: string;
                name?: string;
                picture?: string;
              };
              setSessionDispatch?.({
                data: {
                  user: {
                    email: u.email,
                    name: u.name,
                    image: u.picture,
                  },
                },
                status: "authenticated",
              });
            } catch {
              // ignore
            }
            resolve();
          },
        });
        tokenClient.requestAccessToken();
      });
    } catch (e) {
      console.error(e);
    }
    return;
  }
  if (provider === "github") {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.warn("Set VITE_GITHUB_CLIENT_ID and a backend route to exchange ?code= for a token.");
      return;
    }
    const redirect = encodeURIComponent(`${window.location.origin}/`);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${redirect}`;
  }
}

/** clears OAuth session state after backend logout. */
export function signOut(_options?: { redirect?: boolean }) {
  setSessionDispatch?.({ data: null, status: "unauthenticated" });
  return Promise.resolve();
}
