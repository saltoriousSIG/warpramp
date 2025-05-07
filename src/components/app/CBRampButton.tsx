import React, { useState, useEffect, useRef, useCallback } from "react";
import { initOnRamp, InitOnRampParams } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { toast } from "sonner"

interface CBRampButtonProps {
    destinationWalletAddress: string;
    transferAmount: number;
    contractLoaded: boolean;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    transferAmount,
    contractLoaded
}) => {
    const [isReady, setIsReady] = useState(false);
    const [isInMobile, setIsInMobile] = useState<boolean>(false);
    const onrampInstance = useRef<any>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|warpcast/i.test(navigator.userAgent);
        setIsInMobile(isMobile);
    }, [])

    useEffect(() => {
        const options: InitOnRampParams = {
            appId: (import.meta as any).env.VITE_CB_APP_ID,
            target: '#cbonramp-button-container',
            widgetParameters: {
                addresses: { [destinationWalletAddress]: ['base'] },
                presetFiatAmount: transferAmount,
                assets: ["ETH"],
                defaultNetwork: 'base',
            },
            onSuccess: () => {
                toast("Your purchase was successful")
            },
            onExit: (error: any) => {
                console.error('Onramp exited:', error);
            },
            onEvent: (event: any) => {
                console.log('Onramp event:', event);
            },
            experienceLoggedIn: "embedded" as any,
            experienceLoggedOut: "popup" as any,
            closeOnSuccess: true,
            closeOnExit: true
        };

        if (isInMobile) {
            options.widgetParameters.redirectUrl = "https://warpramp.link/"
        }

        if (onrampInstance.current) {
            onrampInstance.current.destroy();
        }

        initOnRamp(options, (error, instance) => {
            if (error) return
            if (instance) {
                onrampInstance.current = instance;
                setIsReady(true);
            }
        });

        return () => {
            if (onrampInstance.current) {
                onrampInstance.current.destroy();
            }
        };
    }, [destinationWalletAddress, transferAmount, isInMobile]);

    const handleOnPress = useCallback(() => {
        setError(null);

        const amount = Number(transferAmount);
        if (isNaN(amount)) {
            setError("Please enter a valid amount.");
            return;
        }

        if (amount <= 2) {
            setError("Amount must be greater than 2.");
            return;
        }

        if (amount > 5000) {
            setError("Amount exceeds maximum limit of 5,000.");
            return;
        }

        if (onrampInstance.current) {
            onrampInstance.current.open();
        } else {
            setError("Coinbase widget is not initialized.");
        }
    }, [transferAmount, onrampInstance]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <Button
                id="cbonramp-button-container"
                className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
                onClick={handleOnPress}
                disabled={!isReady || !contractLoaded || isNaN(transferAmount) || transferAmount === 0}
            >
                <CoinbaseIcon />
                Buy with Coinbase
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default CBRampButton;;