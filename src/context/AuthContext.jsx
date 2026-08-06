import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const defaultAccount = {
  email: "admin@berjuta.com",
  password: "123456",
  role: "Owner",
};

export function AuthProvider({ children }) {

  // akun yang sedang login
  const [admin, setAdmin] = useState(() => {

    const saved = localStorage.getItem("admin");

    return saved ? JSON.parse(saved) : null;

  });

  // akun utama aplikasi
  const [account, setAccount] = useState(() => {

    const saved = localStorage.getItem("adminAccount");

    return saved
      ? JSON.parse(saved)
      : defaultAccount;

  });

  useEffect(() => {

    localStorage.setItem(
      "adminAccount",
      JSON.stringify(account)
    );

  }, [account]);

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

  const logout = () => {

    setAdmin(null);

  };

  return (

    <AuthContext.Provider
      value={{
        admin,
        setAdmin,

        account,
        setAccount,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export const useAuth = () =>
  useContext(AuthContext);
