
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { SyncProvider } from "./app/SyncContext.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <SyncProvider>
    <App />
  </SyncProvider>
);
  