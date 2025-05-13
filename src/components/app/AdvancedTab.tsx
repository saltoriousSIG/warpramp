"use client"
import React from "react"
import { motion } from "framer-motion"
import CBRampButton from "./CBRampButton"
import { SetAmountsProvider } from "@/providers/SetAmountsProvider"
import SetAmounts from "./SetAmounts"
import RecipientsProvider, { useRecipients } from "@/providers/RecipieintsProvider"
import SetRecipients from "./SetRecipients"


interface AdvancedTabProps {
    contractAddress: string;
    contractLoaded: boolean;
}

const Component: React.FC<{
    contractAddress: string,
    contractLoaded: boolean
}> = ({
    contractAddress,
    contractLoaded
}) => {
        const {
            recipientsConfirmedLoading,
            clearRecipients
        } = useRecipients()

        return (
            <>
                <SetRecipients />
                <SetAmountsProvider>
                    <SetAmounts />
                    <div className="flex flex-col gap-4 px-0">
                        <div className="flex w-full flex-col gap-3">
                            <CBRampButton onCompleteAction={() => clearRecipients()} destinationWalletAddress={contractAddress} contractLoaded={contractLoaded} disabled={recipientsConfirmedLoading} />
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

            </>
        )
    }

const AdvancedTab: React.FC<AdvancedTabProps> = ({
    contractAddress,
    contractLoaded
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative -mt-1 rounded-t-3xl bg-white px-6 pt-6"
        >
            <RecipientsProvider>
                <Component contractAddress={contractAddress} contractLoaded={contractLoaded} />
            </RecipientsProvider>
        </motion.div>
    )
}

export default React.memo(AdvancedTab);