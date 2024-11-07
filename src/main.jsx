import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./route";
import "./style/all.scss";

createRoot(document.getElementById("root")).render(<App />);
