import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "lenis/dist/lenis.css";
import "./styles/tokens.css";
import "./styles/global.css";
import { site } from "./content/index.js";
import App from "./App.jsx";

document.title = site.meta?.title ?? site.name;
document.querySelector('meta[name="description"]')?.setAttribute("content", site.meta?.description ?? "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
