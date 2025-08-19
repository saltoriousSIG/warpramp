import React, { useState, useEffect, useCallback } from "react";
import { generateOnRampURL } from '@coinbase/cbpay-js';
import { Button } from "../ui/button";
import { CoinbaseIcon } from "../core/icons";
import { useSetAmounts } from "@/providers/SetAmountsProvider";
import { useFrameContext } from "@/providers/FrameProdvider";
import axios from "axios";
import { Recipient } from "@/types";
import sdk from "@farcaster/frame-sdk";
import { v4 as uuidv4 } from 'uuid';
interface CBRampButtonProps {
    destinationWalletAddress: string;
    contractLoaded: boolean;
    disabled?: boolean;
    recipients?: Array<Recipient>
    onCompleteAction?: () => void;
}

const CBRampButton: React.FC<CBRampButtonProps> = ({
    destinationWalletAddress,
    contractLoaded,
    disabled,
    recipients,
}) => {
    const [isInMobile, setIsInMobile] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string>();
    const [cbpayUrl, setCbPayUrl] = useState<string>();
    const [requestId, setRequestId] = useState<string>();

    const { fUser, solAddress } = useFrameContext();

    const {
        currency,
        amount: transferAmount,
        receiveEthLoading
    } = useSetAmounts();

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|warpcast/i.test(navigator.userAgent);
        setIsInMobile(isMobile);
    }, []);

    useEffect(() => {
        const load = async () => {
            if (!destinationWalletAddress) return;
            const network = currency === "SOL" ? ['solana'] : ["base"]
            try {
                const { data } = await axios.post("https://api.warpramp.link/get_session_token", {
                    session_data: JSON.stringify({
                        addresses: [
                            {
                                address: destinationWalletAddress,
                                blockchains: network
                            }
                        ],
                        assets: [currency],
                        destinationWalletAddress: [
                            {
                                address: destinationWalletAddress,
                                assets: [currency],
                                blockchains: network,
                                supportedNetworks: network
                            }
                        ]
                    })
                });
                console.log(data, "session token data");
                setSessionToken(data.token);
            } catch (e: any) {
                setError(e.message);
            }
        }
        load();
    }, [destinationWalletAddress, transferAmount, isInMobile, currency, solAddress]);

    const setUrl = useCallback(async () => {
        let request_id;
        try {
            const network = currency === "SOL" ? ['solana'] : ["base"]
            const destination = currency === "SOL" ? solAddress : destinationWalletAddress
            const completeData: Record<string, any> = {
                currency,
                start: new Date().toString()
            }
            if (recipients && recipients.length > 0) {
                const recips = recipients.map((r) => {
                    if (r.type === "farcaster") {
                        return r.id;
                    }
                }).filter(x => x);
                if (recips.length > 0) {
                    completeData.recipients = recips
                }
            }

            if (currency === "USDC") {
                request_id = uuidv4();
            }

            const url = generateOnRampURL({
                appId: (import.meta as any).env.VITE_CB_APP_ID,
                sessionToken,
                addresses: { [destination]: network },
                redirectUrl: currency === "USDC" ? `https://warpramp.link/redirect?request_id=${request_id}` : "https://farcaster.xyz/miniapps/IicCFtcNbkXu/warp-ramp",
                presetFiatAmount: parseFloat(transferAmount),
                assets: [currency],
                defaultNetwork: currency === "SOL" ? "solana" : 'base'
            })
            setCbPayUrl(url);
            setRequestId(request_id);
        } catch (e: any) {
            console.error(e.message);
        }
    }, [currency, destinationWalletAddress, transferAmount, sessionToken])
    useEffect(() => {
        if (!sessionToken) return;
        setUrl();
    }, [setUrl]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <Button
                id="cbonramp-button-container"
                className="h-14 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-base font-medium shadow-md transition-all hover:from-violet-700 hover:to-purple-700 hover:cursor-pointer"
                onClick={async () => {
                    if (currency === "USDC") {
                        await axios.post("https://api.warpramp.link/set_token_request", {
                            requestId,
                            ramp_address: destinationWalletAddress,
                            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                            pool_fee: 500
                        });
                    }
                    sdk.actions.openUrl(cbpayUrl as string)
                }}
                disabled={!contractLoaded || isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0 || disabled || !fUser || receiveEthLoading || !cbpayUrl}
            >
                <CoinbaseIcon />
                Buy {currency} with Coinbase
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default CBRampButton;;