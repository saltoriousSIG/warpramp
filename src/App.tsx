import WarpRamp from "./components/app/WarpRamp";
import { Routes, Route } from "react-router-dom";
import Redirect from "./components/app/Redirect";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<WarpRamp />} />
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </div>

  );
}

export default App;
