"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Wallet, Check } from "@/components/core/icons"
import CBRampButton from "./CBRampButton"
import { SetAmountsProvider } from "@/providers/SetAmountsProvider"
import SetAmounts from "./SetAmounts"
import { useSetAmounts } from "@/providers/SetAmountsProvider"
import { useFrameContext } from "@/providers/FrameProdvider"

interface SimpleTabProps {
    account: string;
    contractAddress: string;
    contractLoaded: boolean;
}

const SimpleTab: React.FC<SimpleTabProps> = ({ account, contractAddress, contractLoaded }) => {
    const { currency } = useSetAmounts();
    const { solAddress } = useFrameContext();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative -mt-1 rounded-t-3xl bg-white px-6 pt-6"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 shadow-sm"
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
            <SetAmountsProvider>
                <SetAmounts />
                <div className="flex flex-col gap-4 px-0">
                    <div className="flex w-full flex-col gap-3">
                        <CBRampButton destinationWalletAddress={currency === "SOL" ? solAddress : contractAddress} contractLoaded={contractLoaded} />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-xs font-medium tracking-wide text-zinc-500"
                    >
                        Powered by Coinbase Onramp • Secure and instant
                    </motion.p>
                </div>
            </SetAmountsProvider>
        </motion.div>
    )
}

export default SimpleTab;