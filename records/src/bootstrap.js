import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "ui/UiContext";
import Standalone from "./Standalone";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UiProvider initialDarkMode={new URLSearchParams(window.location.search).has("dark")}>
      <Standalone />
    </UiProvider>
  </BrowserRouter>
);
