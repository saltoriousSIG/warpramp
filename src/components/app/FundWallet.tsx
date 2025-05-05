import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, Check } from "../core/icons"
import { cn } from "@/lib/utils"
import { sdk } from "@farcaster/frame-sdk";
import axios from "axios";
import CBRampButton from "./CBRampButton"

interface WarpRampProps {
}

const WarpRamp: React.FC<WarpRampProps> = () => {
    const [amount, setAmount] = useState<string>("")
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
    const [account, setAccount] = useState<string>("");
    const [fUser, setFUser] = useState<any>({});


    const presetAmounts = [5, 10, 50, 100]

    const handlePresetClick = (value: number) => {
        setSelectedPreset(value)
        setAmount(value.toString())
    }

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPreset(null)
        setAmount(e.target.value)
    }

    useEffect(() => {
        const load = async () => {
            const context = await sdk.context;
            console.log(context, " context");
            setFUser(context.user);
        }
        load()
    }, []);

    useEffect(() => {
        const checkConnectedWallet = async () => {
            const { data } = await axios.get(`https://api.warpcast.com/fc/primary-address?fid=${fUser.fid}&protocol=ethereum`);
            setAccount(data.result.address.address);

        }
        if (fUser.fid) checkConnectedWallet();
    }, [account, fUser]);


    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
            <Card className="w-full max-w-md overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 pb-8 pt-6 text-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-medium">Warp Ramp</CardTitle>
                        <Wallet className="h-6 w-6" />
                    </div>
                    <CardDescription className="text-zinc-100">Add funds directly to your Warplet</CardDescription>
                </CardHeader>
                <div className="relative -mt-4 rounded-t-3xl bg-white px-6 pt-6">
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                        <div className="flex flex-col  items-start gap-2">
                            <div className="flex h-8 items-center justify-center rounded-full bg-purple-100">
                                <Wallet className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900">Warplet Address</p>
                                <p className="text-xs text-zinc-500">{account?.substring(0, 5)}...{account.substring(account.length - 4, account.length)}</p>
                            </div>
                        </div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-3 w-3 text-green-600" />
                        </span>
                    </div>

                    <CardContent className="px-0 pb-6">
                        <div className="mb-6">
                            <h3 className="mb-3 text-sm font-medium text-zinc-700">Select Amount</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {presetAmounts.map((presetAmount) => (
                                    <Button
                                        key={presetAmount}
                                        variant="outline"
                                        onClick={() => handlePresetClick(presetAmount)}
                                        className={cn(
                                            "h-12 border-zinc-200 text-base font-medium transition-all hover:border-purple-300 hover:bg-purple-50",
                                            selectedPreset === presetAmount
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "text-zinc-700",
                                        )}
                                    >
                                        ${presetAmount}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-3 text-sm font-medium text-zinc-700">Custom Amount</h3>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-medium text-zinc-500">$</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={handleCustomAmountChange}
                                    placeholder="Enter amount"
                                    className="h-12 border-zinc-200 pl-8 text-base focus-visible:ring-purple-500"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 px-0">
                        <CBRampButton transferAmount={parseFloat(amount)} destinationWalletAddress={account} />
                    </CardFooter>
                </div>
            </Card>
        </div>
    )
}

export default WarpRamp;