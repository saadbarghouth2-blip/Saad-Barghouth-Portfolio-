import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { shouldReduceEffects } from "@/lib/perf";

// Hint CSS to avoid expensive effects on constrained devices / connections.
const perfOverride = new URLSearchParams(window.location.search).get("perf");
if (perfOverride === "low") {
  document.documentElement.dataset.perf = "low";
} else if (perfOverride === "full") {
  delete document.documentElement.dataset.perf;
} else if (shouldReduceEffects()) {
  document.documentElement.dataset.perf = "low";
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
