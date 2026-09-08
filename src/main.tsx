import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <main>
      <p className="eyebrow">REACTION PICKER · LIVE STARTER</p>
      <h1>
        A small idea.
        <br />A whole lot of <em>feeling.</em>
      </h1>
      <p>Find a GIF or emoji. Copy a little feeling into a conversation.</p>
      <div className="reactions" aria-label="Example emoji">
        🫠 👀 🚀
      </div>
      <p className="note">
        The tools are ready. The product decisions come next.
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
