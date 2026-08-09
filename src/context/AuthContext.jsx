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

  // User yang sedang login
  const [admin, setAdmin] = useState(() => {

    const saved = localStorage.getItem("admin");

    return saved
      ? JSON.parse(saved)
      : null;

  });

  // Data akun login
  const [account, setAccount] = useState(() => {

    const saved = localStorage.getItem("adminAccount");

    if (saved) {

      return JSON.parse(saved);

    }

    localStorage.setItem(
      "adminAccount",
      JSON.stringify(defaultAccount)
    );

    return defaultAccount;

  });

  // Simpan akun
  useEffect(() => {

    localStorage.setItem(
      "adminAccount",
      JSON.stringify(account)
    );

  }, [account]);

  // Simpan sesi login
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

  // Login
  const login = (email, password) => {

    if (

      email === account.email &&
      password === account.password

    ) {

      const user = {

        email: account.email,
        role: account.role,

      };

      setAdmin(user);

      return {
        success: true,
      };

    }

    return {
      success: false,
    };

  };

  // Logout
  const logout = () => {

    setAdmin(null);

  };

  // Update akun
  const updateAccount = (data) => {

    setAccount((prev) => ({

      ...prev,
      ...data,

    }));

  };

  return (

    <AuthContext.Provider
      value={{

        admin,
        account,

        login,
        logout,

        setAdmin,
        setAccount,

        updateAccount,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}
