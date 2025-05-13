import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, Check } from "../core/icons"
import { cn } from "@/lib/utils"
import { sdk } from "@farcaster/frame-sdk";
import axios from "axios";
import CBRampButton from "./CBRampButton"
import { motion } from "framer-motion"
import { FrameIcon } from "../core/icons"
import { Loader } from "lucide-react"
interface WarpRampProps {
}

const WarpRamp: React.FC<WarpRampProps> = () => {
    const [amount, setAmount] = useState<string>("")
    const [isFrameAdding, setIsFrameAdding] = useState<boolean>(false);
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
    const [account, setAccount] = useState<string>("");
    const [fUser, setFUser] = useState<any>({});
    const [contractLoaded, setContractLoaded] = useState<boolean>(false);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [isFrameAdded, setIsframeAdded] = useState<boolean>(false);
    const [loadContextError, setLoadContextError] = useState<Error | null>(null);

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
            try {
                const context = await sdk.context;
                setFUser(context.user);
                setIsframeAdded(context.client.added);
            } catch (e: any) {
                setLoadContextError(new Error("You must load this page from within Warpcast!"))
            }
        }
        load()
    }, []);

    useEffect(() => {
        const checkConnectedWallet = async () => {
            const { data } = await axios.get(`https://api.warpcast.com/fc/primary-address?fid=${fUser.fid}&protocol=ethereum`);
            setAccount(data.result.address.address);
        }
        if (fUser.fid) checkConnectedWallet();
    }, [fUser]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`https://api.warpramp.link/fetch_user_contract?fid=${fUser.fid}&user_address=${account}`)
                const { contract_address } = data;
                setContractAddress(contract_address);
                setContractLoaded(true);
            } catch (e: any) {
                console.error(e.message)
                return;
            }
        }
        if (fUser.fid && account) load();
    }, [fUser, account]);

    const handleAddFrame = useCallback(async () => {
        try {
            await sdk.actions.addFrame();
            setIsframeAdded(true);
        } catch (e: any) {
            console.error(e.message);
        } finally {
            setIsFrameAdding(false)
        }
    }, []);


    return (
        <div className="flex  flex-col min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="overflow-hidden border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                    {!isFrameAdded && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="w-[95%] m-auto"
                        >
                            <Button
                                onClick={() => {
                                    setIsFrameAdding(true);
                                    handleAddFrame();
                                }}
                                disabled={isFrameAdding}
                                variant="outline"
                                className="font-display relative h-12 w-full border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 text-base font-medium tracking-wide text-indigo-700 transition-all hover:border-indigo-300 hover:shadow-sm disabled:opacity-80"
                            >
                                {isFrameAdding ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        <Loader className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <>
                                        <span className="mr-2">Add Frame</span>
                                        <FrameIcon className="h-5 w-5" />
                                    </>
                                )}

                                <motion.span
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 15,
                                        delay: 1.0,
                                    }}
                                >
                                    +
                                </motion.span>
                            </Button>
                        </motion.div>
                    )}
                    <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 pb-8 pt-6 text-white">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-between"
                        >
                            <CardTitle className="text-2xl font-bold tracking-tight outfit">Warp Ramp</CardTitle>
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Wallet className="h-6 w-6" />
                            </motion.div>
                        </motion.div>
                        <CardDescription className="mt-1 text-zinc-100 outfit">Add funds to your Warplet</CardDescription>
                    </CardHeader>
                    <div className="relative -mt-4 rounded-t-3xl bg-white px-6 pt-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 shadow-sm jakarta"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <Wallet className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Warplet:</p>
                                    <p className="text-xs text-zinc-500">{account?.substring(0, 5)}...{account.substring(account.length - 4, account.length)}</p>
                                </div>
                            </div>
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-3 w-3 text-green-600" />
                                </span>
                            </motion.div>
                        </motion.div>

                        <CardContent className="px-0 pb-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mb-6"
                            >
                                <h3 className="mb-3 text-sm font-semibold tracking-wide text-zinc-700">Select Amount</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {presetAmounts.map((presetAmount) => (
                                        <motion.div key={presetAmount} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                onClick={() => handlePresetClick(presetAmount)}
                                                className={cn(
                                                    "h-12 w-full border-zinc-200 text-base font-medium transition-all duration-200",
                                                    selectedPreset === presetAmount
                                                        ? "border-purple-500 bg-purple-50 text-purple-700 shadow-[0_0_0_1px_rgba(147,51,234,0.5)]"
                                                        : "text-zinc-700 hover:border-purple-300 hover:bg-purple-50/50",
                                                )}
                                                variant="outline"
                                            >
                                                ${presetAmount}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <h3 className="mb-3 text-sm font-semibold tracking-wide text-zinc-700">Custom Amount</h3>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-medium text-zinc-500">
                                        $
                                    </span>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="Enter amount"
                                        className="h-12 border-zinc-200 pl-8 text-base focus-visible:ring-purple-500"
                                    />
                                </div>
                            </motion.div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 px-0">
                            {loadContextError ? (
                                <div className="text-red-500 jakarta font-bold text-xl text-center">
                                    {loadContextError.message}
                                </div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                    <CBRampButton destinationWalletAddress={contractAddress} transferAmount={parseFloat(amount)} contractLoaded={contractLoaded} />
                                </motion.div>
                            )}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center text-xs font-medium text-zinc-500"
                            >
                                Powered by Coinbase Onramp • Secure and instant
                            </motion.p>
                        </CardFooter>
                    </div>
                </Card>
            </motion.div>


        </div>
    )
}

export default WarpRamp;