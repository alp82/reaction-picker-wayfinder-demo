import { createRoot } from "react-dom/client";
import "./style.css";
import { GifSearchPrototype } from "./prototype/GifSearchPrototype";

// PROTOTYPE (ticket #4): the landing page is replaced by the variant switcher on this branch.
createRoot(document.getElementById("root")!).render(<GifSearchPrototype />);
