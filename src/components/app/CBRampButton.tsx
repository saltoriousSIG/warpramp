import React, { useState, useEffect, useCallback } from "react";
import { generateOnRampURL } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { toast } from "sonner";

interface CBRampButtonProps {
    destinationWalletAddress: string;
    transferAmount: number;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    transferAmount
}) => {
    const [rampUrl, setRampUrl] = useState<string>();

    useEffect(() => {
        const options = {
            appId: (import.meta as any).env.VITE_CB_APP_ID, // Obtained from Coinbase Developer Platform
            addresses: { [destinationWalletAddress]: ['base'] },
            presetFiatAmount: transferAmount, // Prefill 100 USD
            sourceCurrency: 'USD', // Fiat currency
            assets: ["ETH"],
            defaultNetwork: 'base', //
            redirectUrl: 'https://warpramp-ztqy.vercel.app/'
        };
        const rampUrl = generateOnRampURL(options);
        setRampUrl(rampUrl);
    }, [destinationWalletAddress, transferAmount]);

    const handleOnPress = useCallback(
        () => {
            if (!transferAmount) return toast("Please enter an amount!");
            if (rampUrl) window.location.href = rampUrl;
        }, [transferAmount, rampUrl]
    )
    return (
        <Button
            className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
            onClick={handleOnPress}
            disabled={!rampUrl}
        >
            <CoinbaseIcon />
            Buy with Coinbase
        </Button>
    );
}

export default CBRampButton;;