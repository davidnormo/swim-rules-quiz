import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <style>{`#root { width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  font-size: 1.4em;
  }`}</style>
    <App />
  </StrictMode>
);
