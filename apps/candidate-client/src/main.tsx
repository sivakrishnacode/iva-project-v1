import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Router from "./router/router.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <div className="watermark">Candidate Dashboard</div>
    <Router />
  </BrowserRouter>
);
