import React, { useState, useEffect, useRef, useCallback } from "react";
import { initOnRamp } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { toast } from "sonner"

interface CBRampButtonProps {
    destinationWalletAddress: string;
    transferAmount: number;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    transferAmount
}) => {
    const [isReady, setIsReady] = useState(false);
    const onrampInstance = useRef<any>();
    useEffect(() => {
        const options = {
            appId: (import.meta as any).env.VITE_CB_APP_ID, // Obtained from Coinbase Developer Platform
            target: '#cbonramp-button-container',
            widgetParameters: {
                addresses: { [destinationWalletAddress]: ['base'], "0xAB51Bc7aa8636328E91bCC1B6bf701998fD3C581": ['base'] },
                presetFiatAmount: transferAmount, // Prefill 100 USD
                sourceCurrency: 'USD', // Fiat currency
                assets: ["ETH"],
                defaultNetwork: 'base', //
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
            experienceLoggedIn: 'embedded' as any,
            experienceLoggedOut: 'popup' as any,
            closeOnSuccess: true
        };

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
    }, [destinationWalletAddress, transferAmount]);

    const handleOnPress = useCallback(
        () => {
            onrampInstance.current.open();
        }, [transferAmount]
    )

    return (
        <Button
            className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
            disabled={!isReady}>
            <CoinbaseIcon />
            Buy with Coinbase
        </Button>
    );
}

export default CBRampButton;;