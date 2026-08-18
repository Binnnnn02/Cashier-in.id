import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { ProductProvider } from "./context/ProductContext";

createRoot(document.getElementById("root")).render(

  <StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <StoreProvider>

          <ProductProvider>

            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
            />

          </ProductProvider>

        </StoreProvider>

      </AuthProvider>

    </BrowserRouter>

  </StrictMode>

);