import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import WarpRamp from "./components/app/FundWallet";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <WarpRamp />
      <Toaster />
    </div>
  );
}

export default App;
