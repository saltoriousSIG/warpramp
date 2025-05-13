import { Toaster } from "sonner";
import WarpRamp from "./components/app/WarpRamp";


function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <WarpRamp />
      <Toaster />
    </div>
  );
}

export default App;
