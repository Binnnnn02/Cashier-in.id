import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [admin, setAdmin] = useState(() => {

    const saved = localStorage.getItem("admin");

    return saved ? JSON.parse(saved) : null;

  });

  useEffect(() => {

    if (admin) {

      localStorage.setItem(
        "admin",
        JSON.stringify(admin)
      );

    } else {

      localStorage.removeItem("admin");

    }

  }, [admin]);

  return (

    <AuthContext.Provider
      value={{
        admin,
        setAdmin,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export const useAuth = () =>
  useContext(AuthContext);