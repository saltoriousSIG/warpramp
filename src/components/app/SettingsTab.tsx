"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CopyIcon, ExternalLinkIcon, BellIcon } from "@/components/core/icons"
import { useFrameContext } from "@/providers/FrameProdvider"
import axios from 'axios'
import sdk from "@farcaster/frame-sdk"

interface SettingsTabProps {
    fid: number;
    contractAddress: string;
}

interface UserInfo {
    name: string;
    username: string;
    avatar: string;
    proxyAddress: string;
    address: string;
    transactions: Array<{
        id: string;
        currency: "ETH" | "USDC";
        date: Date;
    }>
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    fid,
    contractAddress
}) => {
    const [notifications, setNotifications] = useState(true)
    const [autoApprove, setAutoApprove] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { context } = useFrameContext();

    const handleGoToBasescan = useCallback(async () => {
        try {
            await sdk.actions.openUrl(`https://basescan.org/address/${contractAddress}`)
        } catch (e: any) {
            console.error(e.message);
        }
    }, [contractAddress]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`https://api.warpramp.link/fetch_user?fid=${fid}`);
                const { user_data } = data;
                console.log(user_data);
                setUserInfo({
                    name: user_data.display_name,
                    username: user_data.username,
                    avatar: user_data.pfp_url,
                    address: contractAddress,
                    proxyAddress: `${contractAddress.substring(0, 7)}...${contractAddress.substring(contractAddress.length - 5, contractAddress.length)}`,
                    transactions: []
                })
            } catch (e: any) {
                setError(new Error(e.message));
            }
        }
        if (fid) load()
    }, [fid, contractAddress]);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(userInfo?.address as string)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative -mt-1 rounded-t-3xl bg-white px-6 pt-6 jakarta"
        >
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex flex-col items-center"
            >
                <Avatar className="mb-3 h-20 w-20 border-4 border-white shadow-md">
                    <AvatarImage src={userInfo?.avatar || "/placeholder.svg"} alt={userInfo?.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                        {userInfo?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-display text-xl font-bold">{userInfo?.name}</h2>
                <p className="text-sm text-zinc-500">@{userInfo?.username}</p>
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 rounded-xl border border-zinc-100 bg-zinc-50 p-4"
            >
                <div className="text-xs mb-5">
                    Your ramp address executes your selected actions. You fund them via Coinbase. Everything viewable on BaseScan.
                </div>
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold text-zinc-700">Ramp Address</h3>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                            onClick={handleCopyAddress}
                        >
                            <CopyIcon className="h-4 w-4" />
                            <span className="sr-only">Copy address</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                            onClick={handleGoToBasescan}
                        >
                            <ExternalLinkIcon className="h-4 w-4" />
                            <span className="sr-only">View on explorer</span>
                        </Button>
                    </div>
                </div>
                <div className="relative rounded-lg bg-white p-3 font-mono text-xs text-zinc-700">
                    <span className="w-full m-auto text-center flex item-center justify-center">

                        {userInfo?.proxyAddress}
                    </span>
                    {isCopied && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -right-1 -top-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                        >
                            Copied!
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
            >
                <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-700">Preferences</h3>
                <div className="space-y-4 rounded-xl border border-zinc-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BellIcon className="h-5 w-5 text-purple-600" />
                            <Label htmlFor="notifications" className="text-sm font-medium">
                                Notifications
                            </Label>
                        </div>
                        <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                            className="data-[state=checked]:bg-purple-600"
                        />
                    </div>
                </div>
            </motion.div> */}

            {/* <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
            >
                <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Recent Transactions
                </h3>
                <div className="rounded-xl border border-zinc-100 bg-white">
                    {userInfo?.transactions?.map((tx, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between p-4">

                            </div>
                            {index < userInfo.transactions.length - 1 && <Separator />}
                        </div>
                    ))}
                </div>
            </motion.div> */}
        </motion.div>
    )
}

export default SettingsTab;