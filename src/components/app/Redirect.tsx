import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card"
import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";
import { Loader2 } from "lucide-react"

interface RedirectProps { }

const Redirect: React.FC<RedirectProps> = ({ }) => {
    const [searchParams] = useSearchParams();

    const request_id = searchParams.get("request_id");
    const ramp_address = searchParams.get("ramp_address");

    function watchTransfer(rpcUrl: string, usdcAddress: `0x${string}`, rampAddress: string, onTransfer: Function) {
        const client = createPublicClient({
            chain: base,
            transport: http(rpcUrl)
        })
        return client.watchEvent({
            address: usdcAddress,
            event: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)'])[0],
            onLogs: (logs) => {
                const transfer = logs.find(log => log.args.to?.toLowerCase() === rampAddress.toLowerCase())
                if (transfer) {
                    onTransfer(transfer)
                }
            }
        })
    }

    useEffect(() => {
        const unwatch = watchTransfer(
            'https://mainnet.base.org',
            '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            ramp_address as string,
            async () => {
                // Transfer detected - add to queue
                await axios.post("https://api.warpramp.link/add_transfer_queue", {
                    request_id
                });
                window.location.replace("https://farcaster.xyz/miniapps/IicCFtcNbkXu/warp-ramp")
            }
        )
        return unwatch
    }, [ramp_address, request_id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center text-white">
                        <h1 className="text-2xl font-bold mb-1">Warp Ramp</h1>
                        <p className="text-purple-100 text-sm">Add funds to your warplet</p>
                    </div>

                    <div className="p-8 text-center">
                        <div className="mb-6">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Connecting to Coinbase</h2>
                            <p className="text-slate-600 text-sm">Redirecting you to complete your transaction</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500">Powered by Coinbase</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Redirect;