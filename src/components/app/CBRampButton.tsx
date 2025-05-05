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
    const [isInMobile, setIsInMobile] = useState<boolean>(false);
    const [isWidgetVisible, setIsWidgetVisible] = useState(false);
    const onrampInstance = useRef<any>();

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsInMobile(isMobile);
    }, [])

    useEffect(() => {
        const options = {
            appId: (import.meta as any).env.VITE_CB_APP_ID, // Obtained from Coinbase Developer Platform
            target: '#cbonramp-button-container',
            widgetParameters: {
                addresses: { [destinationWalletAddress]: ['base'] },
                presetFiatAmount: transferAmount, // Prefill 100 USD
                sourceCurrency: 'USD', // Fiat currency
                assets: ["ETH"],
                defaultNetwork: 'base', //
                redirectUrl: "https://warpramp-ztqy.vercel.app/",
            },
            onSuccess: () => {
                setIsWidgetVisible(false);
                toast("Your purchase was successful")
            },
            onExit: (error: any) => {
                setIsWidgetVisible(false);
                console.error('Onramp exited:', error);
            },
            onEvent: (event: any) => {
                console.log('Onramp event:', event);
            },
            experienceLoggedIn: "embedded" as any,
            experienceLoggedOut: 'popup' as any,
            closeOnSuccess: true,
            closeOnExit: true
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
    }, [destinationWalletAddress, transferAmount, isInMobile]);

    const handleOnPress = useCallback(
        () => {
            setIsWidgetVisible(true);
            onrampInstance.current.open();
        }, [transferAmount]
    )

    return (
        <>
            {!isWidgetVisible ? (
                <Button
                    id="cbonramp-button-container"
                    className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
                    onClick={handleOnPress}
                    disabled={!isReady}
                >
                    <CoinbaseIcon />
                    Buy with Coinbase
                </Button>
            ) : (
                <div id="cbpay-widget-container">
                    {/* Widget mounts here automatically in embedded mode */}
                </div>

            )}
        </>
    );
}

export default CBRampButton;;