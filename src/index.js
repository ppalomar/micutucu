import React from "react";
import { createRoot } from 'react-dom/client';
import "./styles.css";
import "./i18n"; // Importar la configuración de i18n
import App from "./App";
import { AppProvider } from "./context";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
