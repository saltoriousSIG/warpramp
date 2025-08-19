import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { FrameSDKProvider } from "./providers/FrameProdvider.tsx";
import { BrowserRouter } from 'react-router-dom';
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { Toaster } from "sonner";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FrameSDKProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </FrameSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
