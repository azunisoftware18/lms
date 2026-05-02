import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReduxProvider } from "./providers/reduxProvider";
import { QueryProvider } from "./providers/queryProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { ToasterProvider } from "./providers/toasterProvider";
import { AadhaarProvider } from "./contexts/AadhaarContext";
import { PanProvider } from "./contexts/PanContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
      <ReduxProvider>
        <QueryProvider>
          <AadhaarProvider>
            <PanProvider>
              <AppRoutes />
              <ToasterProvider />
            </PanProvider>
          </AadhaarProvider>
        </QueryProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
);
