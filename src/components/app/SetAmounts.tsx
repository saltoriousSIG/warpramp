import React from "react";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EthereumIcon, UsdcIcon, SwapIcon } from "../core/icons";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { useSetAmounts } from "@/providers/SetAmountsProvider";
import { CurrencyType } from "@/types";
import { useFrameContext } from "@/providers/FrameProdvider";
import { toast } from "sonner";

interface SetAmountsProps { }

const SetAmounts: React.FC<SetAmountsProps> = () => {
    const {
        isFrameAdded
    } = useFrameContext();
    const {
        amount,
        presetAmounts,
        selectedPreset,
        currency,
        receiveEth,
        handleSetAmount,
        handleSetReceiveEth,
        handleSetReceiveEthLoading,
        handleSetSelectedPreset,
        handleSetCurrency
    } = useSetAmounts();

    return (
        <div className="px-0">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
            >
                <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Select Amount
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {presetAmounts.map((presetAmount, index) => (
                        <motion.div key={index} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                            <Button
                                onClick={() => handleSetSelectedPreset(presetAmount)}
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
                transition={{ delay: 0.35 }}
                className="mb-6"
            >
                <div className="mb-4 flex flex-col items-start justify-start">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">Select Currency</h3>
                    <Tabs value={currency} onValueChange={(value) => {
                        if (!isFrameAdded) {
                            return toast("Please add this frame to use this feature!");
                        }
                        handleSetCurrency(value as CurrencyType)
                    }} className="h-9">
                        <TabsList className="h-9 bg-zinc-100 p-1">
                            <TabsTrigger
                                value="ETH"
                                className="h-7 gap-x-1.5 px-3 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                            >
                                <EthereumIcon className="mr-1 h-3.5 w-3.5" />
                                ETH
                            </TabsTrigger>
                            <TabsTrigger
                                value="USDC"
                                className="h-7 px-3 gap-x-1.5 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                            >
                                <UsdcIcon className="mr-1 h-3.5 w-3.5" />
                                USDC
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
            >
                <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Custom Amount
                </h3>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-medium text-zinc-500">$</span>
                    <Input
                        type="number"
                        value={amount}
                        min={0}
                        onChange={(e) => handleSetAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="h-12 border-zinc-200 pl-8 text-base focus-visible:ring-purple-500"
                    />
                </div>
            </motion.div>

            {currency === "USDC" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8 rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                >
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="receive-eth"
                            checked={receiveEth}
                            onCheckedChange={(checked) => {
                                handleSetReceiveEth(checked === true)
                                if (checked === true) {
                                    handleSetReceiveEthLoading(true)
                                }
                            }}
                            className="mt-1 border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                        />
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="receive-eth"
                                className="flex cursor-pointer items-center text-sm font-medium text-zinc-900"
                            >
                                <SwapIcon className="mr-1.5 h-4 w-4 text-purple-600" />
                                Receive WETH instead of USDC
                            </Label>
                            <p className="text-xs text-zinc-500">
                                Buy USDC and automatically convert it to WETH in a single transaction
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default SetAmounts;