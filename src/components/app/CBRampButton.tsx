import React, { useState, useEffect, useRef, useCallback } from "react";
import { initOnRamp, InitOnRampParams } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { toast } from "sonner"
import { useSetAmounts } from "@/providers/SetAmountsProvider";
import { useFrameContext } from "@/providers/FrameProdvider";
import axios from "axios";

interface CBRampButtonProps {
    destinationWalletAddress: string;
    contractLoaded: boolean;
    disabled?: boolean;
    onCompleteAction?: () => void;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    contractLoaded,
    disabled,
    onCompleteAction
}) => {
    const [isReady, setIsReady] = useState(false);
    const [isInMobile, setIsInMobile] = useState<boolean>(false);
    const onrampInstance = useRef<any>();
    const [error, setError] = useState<string | null>(null);

    const { fUser } = useFrameContext();

    const {
        currency,
        amount: transferAmount,
        receiveEthLoading
    } = useSetAmounts();

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
                presetFiatAmount: parseFloat(transferAmount),
                assets: [currency],
                defaultNetwork: 'base',
            },
            onSuccess: async () => {
                if (onCompleteAction) onCompleteAction();
                toast("Your purchase was successful")
                if (currency === "USDC") {
                    try {
                        const { data } = await axios.get(`https://api.warpramp.link/launch_token_listener?fid=${fUser?.fid}`);
                        console.log(data)
                    } catch (e: any) {
                        console.error(e.message)
                    }
                }

            },
            onExit: (error: any) => {
                if (onCompleteAction) onCompleteAction();
                console.error('Onramp exited:', error);
                localStorage.removeItem("onrampOpen");
                localStorage.removeItem("listener_id");
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
    }, [destinationWalletAddress, transferAmount, isInMobile, currency]);

    const handleOnPress = useCallback(async () => {
        setError(null);
        if (!fUser) return
        const amount = Number(transferAmount);
        if (isNaN(amount)) {
            setError("Please enter a valid amount.");
            return;
        }

        if (amount <= 0) {
            setError("Amount must be greater than 0.");
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
    }, [transferAmount, onrampInstance, currency, fUser]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <Button
                id="cbonramp-button-container"
                className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
                onClick={handleOnPress}
                disabled={!isReady || !contractLoaded || isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0 || disabled || !fUser || receiveEthLoading}
            >
                <CoinbaseIcon />
                Buy {currency} with Coinbase
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default CBRampButton;;