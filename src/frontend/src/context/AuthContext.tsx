import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const STORAGE_KEY = "halfbuilt_user";

export interface AuthUser {
  githubId: string;
  githubUsername: string;
  githubAvatarUrl: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isConnected: boolean;
  setUserData: (userData: AuthUser) => void;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isConnected: false,
  setUserData: () => {},
  disconnect: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const setUserData = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const disconnect = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isConnected: !!user, setUserData, disconnect }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
