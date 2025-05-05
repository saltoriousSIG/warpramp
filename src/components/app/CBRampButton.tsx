import React, { useState, useEffect, useCallback } from "react";
import { generateOnRampURL } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { sdk } from "@farcaster/frame-sdk";
import { toast } from "sonner";
interface CBRampButtonProps {
    destinationWalletAddress: string;
    transferAmount: number;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    transferAmount
}) => {
    //const [isReady, setIsReady] = useState(false);
    const [rampUrl, setRampUrl] = useState<string>();


    useEffect(() => {
        const options = {
            appId: (import.meta as any).env.VITE_CB_APP_ID, // Obtained from Coinbase Developer Platform
            addresses: { [destinationWalletAddress]: ['base'] },
            assets: ['ETH'],
            handlingRequestedUrls: true,
            presetFiatAmount: transferAmount,
            redirect_url: "https://warpramp-ztqy.vercel.app/"
        };
        const onrampUrl = generateOnRampURL(options);
        setRampUrl(onrampUrl);
    }, [destinationWalletAddress, transferAmount]);

    const handleOnPress = useCallback(
        () => {
            if (!transferAmount || isNaN(transferAmount)) return toast("Please enter an amount!")
            if (rampUrl) window.location.href = rampUrl;
        }, [rampUrl, transferAmount]
    )

    return (
        <Button id="cbonramp-button-container"
            className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
            onClick={handleOnPress}
        >
            <CoinbaseIcon />
            Buy with Coinbase
        </Button>
    );
}

export default CBRampButton;;