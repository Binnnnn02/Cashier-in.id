import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const StoreContext = createContext();

const defaultStore = {
  name: "KasirKu",
  owner: "",
  email: "",
  phone: "",
  address: "",
  logo: "",

  footer: "Terima kasih telah berbelanja.",

  tax: 0,
  discount: 0,

  paymentMethod: "Tunai",

  notification: {
    stock: true,
    sound: true,
    autoPrint: false,
  },

  receipt: {
    showLogo: true,
    showAddress: true,
    showPhone: true,
    showTax: false,
  },
};

export function StoreProvider({ children }) {

  const [store, setStore] = useState(() => {

    const saved = localStorage.getItem("store");

    return saved
      ? JSON.parse(saved)
      : defaultStore;

  });

  useEffect(() => {

    localStorage.setItem(
      "store",
      JSON.stringify(store)
    );

  }, [store]);

  return (

    <StoreContext.Provider
      value={{
        store,
        setStore,
      }}
    >

      {children}

    </StoreContext.Provider>

  );

}

export const useStore = () =>
  useContext(StoreContext);