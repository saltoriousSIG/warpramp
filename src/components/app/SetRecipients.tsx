import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader, UserIcon, SearchIcon, XIcon, UsersIcon, PercentIcon, PlusIcon } from "@/components/core/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useRecipients } from '@/providers/RecipieintsProvider';
import { toast } from 'sonner';
import { useFrameContext } from '@/providers/FrameProdvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';


interface SetRecipientsProps { }

const SetRecipients: React.FC<SetRecipientsProps> = ({ }) => {
    const {
        allocationType,
        searchResults,
        selectedWallet,
        recipients,
        connectedWallets,
        recipientType,
        isSearching,
        handleConfirmRecipients,
        handleSetRecipientsConfirmedLoading,
        handleSetRecipientsType,
        handleAddWallet,
        handleSetSelectedWallet,
        handleSearch,
        handleAddUser,
        handleRemoveRecipient,
        handleSetAllocationType,
        handleAllocationChange
    } = useRecipients();

    const { isFrameAdded } = useFrameContext();

    const [searchTerm, setSearchTerm] = useState<string>("")

    const totalAllocation = recipients.reduce((sum, recipient) => sum + recipient.allocation, 0)
    const remainingAllocation = 100 - totalAllocation

    return (
        <>
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                {!isFrameAdded && (
                    <Alert variant="destructive" className="mb-4 bg-red-200/70">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Add Frame</AlertTitle>
                        <AlertDescription className='text-xs'>
                            Add this frame to use advanced features!
                        </AlertDescription>
                    </Alert>
                )}
                <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-700">Recipients</h3>
                <RadioGroup
                    disabled={!isFrameAdded}
                    defaultValue="wallet"
                    value={recipientType}
                    onValueChange={handleSetRecipientsType}
                    className="flex space-x-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wallet" id="wallet" className="border-purple-200 text-purple-600 bg-white" />
                        <Label htmlFor="wallet" className="cursor-pointer font-medium">
                            My Wallets
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="farcaster" id="farcaster" className="border-purple-200 text-purple-600 bg-white" />
                        <Label htmlFor="farcaster" className="cursor-pointer font-medium">
                            Farcaster User
                        </Label>
                    </div>
                </RadioGroup>
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
            >
                {recipientType === "wallet" ? (
                    <>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                Select Wallet
                            </h3>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleAddWallet}
                                disabled={!selectedWallet}
                                className="h-8 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                            >
                                Add
                            </Button>
                        </div>
                        <Select
                            disabled={!isFrameAdded}
                            value={selectedWallet}
                            onValueChange={handleSetSelectedWallet}
                        >
                            <SelectTrigger className="h-12 border-zinc-200 focus:ring-purple-500">
                                <SelectValue placeholder="Select a wallet" />
                            </SelectTrigger>
                            <SelectContent>
                                {connectedWallets.map((wallet, index) => (

                                    <SelectItem key={index} value={wallet.id}>
                                        <div className="flex items-center">
                                            <span className="mr-2">{wallet.name}</span>
                                            <span className="text-xs text-zinc-500">({wallet.address})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                ) : (
                    <>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                Find Farcaster Users
                            </h3>
                            <div className="flex items-center text-xs text-zinc-500">
                                <UsersIcon className="mr-1 h-3 w-3" />
                                <span>Add multiple users</span>
                            </div>
                        </div>
                        <div className="relative mb-2">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by username"
                                className="h-12 border-zinc-200 pl-10 pr-12 focus-visible:ring-purple-500"
                            />
                            <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSearch(searchTerm)}
                                disabled={!searchTerm || isSearching}
                                className="absolute right-1 top-1/2 h-8 -translate-y-1/2 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                            >
                                {isSearching ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    >
                                        <Loader className="h-4 w-4" />
                                    </motion.div>
                                ) : (
                                    <SearchIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-10 mt-1 w-[calc(100%-3rem)] rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                            >
                                {searchResults.map((user, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ backgroundColor: "rgba(233, 213, 255, 0.5)" }}
                                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-2"
                                        onClick={() => handleAddUser(user)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                                                <AvatarFallback className="bg-purple-100 text-purple-700">
                                                    {user.displayName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.displayName}</p>
                                                <p className="text-xs text-zinc-500">@{user.value}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 rounded-full p-0">
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>

            {recipients.length > 0 && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-6 rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-display text-sm font-semibold text-zinc-700">Selected Recipients</h3>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {recipients.length} {recipients.length === 1 ? "recipient" : "recipients"}
                        </Badge>
                    </div>

                    <div className="mb-4 space-y-2">
                        <AnimatePresence>
                            {recipients.map((recipient, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            {recipient.type === "farcaster" ? (
                                                <>
                                                    <AvatarImage src={recipient.avatar || "/placeholder.svg"} alt={recipient.displayName} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-700">
                                                        {recipient.displayName?.charAt(0)}
                                                    </AvatarFallback>
                                                </>
                                            ) : (
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                    {recipient.displayName?.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-zinc-900">{recipient.displayName}</p>
                                            <p className="text-xs text-zinc-500">
                                                {recipient.type === "farcaster" ? `@${recipient.value}` : recipient.value}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {allocationType === "custom" && (
                                            <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1">
                                                <PercentIcon className="h-3 w-3 text-purple-600" />
                                                <span className="text-xs font-semibold text-purple-700">
                                                    {recipient.allocation.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveRecipient(recipient.id)}
                                            className="h-7 w-7 rounded-full p-0 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {recipients.length > 1 && (
                        <div className="rounded-lg border border-zinc-200 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="font-display text-sm font-medium text-zinc-700">Allocation</h4>
                                <Tabs
                                    value={allocationType}
                                    onValueChange={(v) => handleSetAllocationType(v as "equal" | "custom")}
                                    className="h-7"
                                >
                                    <TabsList className="h-7 bg-zinc-100">
                                        <TabsTrigger value="equal" className="h-5 px-3 text-xs">
                                            Split Equally
                                        </TabsTrigger>
                                        <TabsTrigger value="custom" className="h-5 px-3 text-xs">
                                            Custom
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {allocationType === "equal" ? (
                                <div className="flex items-center justify-center rounded-lg bg-purple-50 p-2 text-center">
                                    <p className="text-sm font-medium text-purple-700">
                                        Each recipient will receive {(100 / recipients.length).toFixed(1)}% of the funds
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recipients.map((recipient, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-medium text-zinc-700">{recipient.displayName}</p>
                                                <p className="text-xs font-medium text-purple-700">{recipient.allocation.toFixed(1)}%</p>
                                            </div>
                                            <Slider
                                                value={[recipient.allocation]}
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                onValueChange={(value) => handleAllocationChange(recipient.id, value[0])}
                                                className="py-1"
                                            />
                                        </div>
                                    ))}

                                    <div
                                        className={cn(
                                            "mt-2 rounded-lg p-2 text-center text-sm font-medium",
                                            Math.abs(totalAllocation - 100) < 0.1
                                                ? "bg-green-50 text-green-700"
                                                : "bg-amber-50 text-amber-700",
                                        )}
                                    >
                                        {Math.abs(totalAllocation - 100) < 0.1 ? (
                                            <p>Allocation complete (100%)</p>
                                        ) : (
                                            <p>
                                                {remainingAllocation > 0
                                                    ? `${remainingAllocation.toFixed(1)}% remaining`
                                                    : `${Math.abs(remainingAllocation).toFixed(1)}% over allocated`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <Button
                        className="w-full bg-blue-500 uppercase letter-spacing-[2px] hover:cursor-pointer hover:bg-blue-500/70 mt-5"
                        onClick={async () => {
                            if (Math.floor(remainingAllocation) !== 0) {
                                return toast("Allocations must equal 100%!")
                            }
                            handleSetRecipientsConfirmedLoading(true);
                            await handleConfirmRecipients();
                        }}
                    >
                        Confirm
                    </Button>
                </motion.div>
            )}
        </>
    );
}

export default SetRecipients;