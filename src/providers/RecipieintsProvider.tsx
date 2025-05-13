import React, { createContext, useState, ReactNode, FC, useCallback, useEffect } from 'react';
import { Recipient, Allocations, RecipientType, ConnectedWallets } from '@/types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useFrameContext } from './FrameProdvider';
import { handle_set_options } from '@/lib/utils';
import { checksumAddress } from 'viem';
import { toast } from 'sonner';


interface RecipientsContextValue {
    allocationType: Allocations;
    errors: Record<string, Error> | null;
    isSearching: boolean;
    recipients: Array<Recipient>;
    recipientType: RecipientType;
    searchResults: Array<Recipient>;
    selectedWallet: string;
    confirmSelection: boolean;
    connectedWallets: Array<ConnectedWallets>;
    recipientsConfirmedLoading: boolean;
    clearRecipients: () => void;
    handleSetRecipientsConfirmedLoading: (state: boolean) => void;
    handleConfirmRecipients: () => Promise<void>;
    handleSearch: (username: string) => void;
    handleAddWallet: () => void;
    handleRemoveRecipient: (id: string | number) => void;
    handleAllocationChange: (id: string | number, value: number) => void;
    handleAddUser: (user: any) => void;
    handleSetRecipientsType: (type: RecipientType) => void;
    handleSetAllocationType: (type: Allocations) => void;
    handleSetSelectedWallet: (wallet: string) => void;
}

interface RecipientsProviderProps {
    children: ReactNode;
}

export const RecipientsContext = createContext<RecipientsContextValue | undefined>(undefined);

export const useRecipients = (): RecipientsContextValue => {
    const context = React.useContext(RecipientsContext);
    if (!context) {
        throw new Error('useRecipients must be used within a RecipientsProvider');
    }
    return context;
};


const RecipientsProvider: FC<RecipientsProviderProps> = ({ children }) => {
    const {
        fUser
    } = useFrameContext();


    const [connectedWallets, setConnectedWallets] = useState<Array<ConnectedWallets>>([]);
    const [allocationType, setAllocationType] = useState<Allocations>("equal")
    const [errors, setErrors] = useState<Record<string, Error> | null>(null);
    const [isSearching, setIsSearching] = useState(false)
    const [recipients, setRecipients] = useState<Recipient[]>([])
    const [recipientType, setRecipientType] = useState<RecipientType>("wallet")
    const [searchResults, setSearchResults] = useState<Recipient[]>([])
    const [selectedWallet, setSelectedWallet] = useState<string>("")
    const [confirmSelection, setConfirmSelection] = useState<boolean>(false);
    const [recipientsConfirmedLoading, setRecipientsConfirmedLoading] = useState<boolean>(false);

    useEffect(() => {
        setRecipients([]);
    }, [recipientType]);

    useEffect(() => {
        if (recipients.length >= 1) {
            setRecipientsConfirmedLoading(true);
        } else {
            setRecipientsConfirmedLoading(false);
        }
    }, [recipients])

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`https://api.warpramp.link/fetch_user_addresses?fid=${fUser?.fid}`);
                const { addresses, primary } = data;
                const connectedWallets = addresses.map((address: string, index: number) => {
                    if (address === primary) {
                        return {
                            name: "Primary",
                            fullAddress: address,
                            address: `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`,
                            id: uuidv4()
                        }
                    }
                    return {
                        name: "Wallet " + (index + 1),
                        fullAddress: address,
                        address: `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`,
                        id: uuidv4()
                    }
                })
                setConnectedWallets(connectedWallets);
            } catch (e: any) {
                setErrors({
                    ...errors,
                    load_addresses: new Error("There was an error loading addresses " + e.message)
                })
            }
        }
        if (fUser?.fid && connectedWallets.length === 0) load();
    }, [fUser?.fid, connectedWallets]);

    useEffect(() => {
        if (recipients.length === 0) return

        const newRecipients = [...recipients]

        if (allocationType === "equal") {
            const equalShare = 100 / recipients.length
            newRecipients.forEach((recipient) => {
                recipient.allocation = Number.parseFloat(equalShare.toFixed(2))
            })
        } else if (allocationType === "custom" && recipients.length === 1) {
            // If there's only one recipient in custom mode, they get 100%
            newRecipients[0].allocation = 100
        }

        setRecipients(newRecipients)
    }, [recipients.length, allocationType]);

    const handleSetSelectedWallet = (wallet: string) => {
        setSelectedWallet(wallet);
    }

    const handleSetRecipientsType = (type: RecipientType) => {
        setRecipientType(type);
    }

    const handleSetAllocationType = (type: Allocations) => {
        setAllocationType(type);
    }

    const handleSetRecipientsConfirmedLoading = (state: boolean) => {
        setRecipientsConfirmedLoading(state);
    }

    const handleSearch = (username: string) => {
        setIsSearching(true)
        // Simulate API call to search Farcaster users
        const load = async () => {
            try {
                const { data } = await axios.get(`https://api.warpramp.link/user_search?username=${username}`);
                const { user_data } = data;
                const recipients = user_data.map((u: any) => ({
                    id: u.fid,
                    type: "farcaster",
                    displayName: u.display_name,
                    value: u.username,
                    address: u.verified_addresses.primary.eth_address,
                    avatar: u.pfp_url,
                    allocation: 0
                }))
                setSearchResults(recipients);
            } catch (e: any) {
                setErrors({
                    ...errors,
                    search_user: new Error(`There was an error searching for user ${username} ${e.messgae}`)

                })
            } finally {
                setIsSearching(false)
            }
        }

        load();
    }

    const handleAddWallet = () => {
        setConfirmSelection(false);
        if (!selectedWallet) return
        // Check if wallet is already in recipients
        if (recipients.some((r) => r.type === "wallet" && r.id === selectedWallet)) {
            return
        }
        const wallet = connectedWallets.find((w) => w.id === selectedWallet)
        if (!wallet) return

        const newRecipient: Recipient = {
            id: wallet.id,
            type: "wallet",
            displayName: wallet.name,
            value: wallet.address,
            address: wallet.fullAddress,
            allocation: allocationType === "equal" ? 100 / (recipients.length + 1) : 0,
        }

        setRecipients([...recipients, newRecipient])
        setSelectedWallet("")
    }

    const handleRemoveRecipient = (id: string | number) => {
        setConfirmSelection(false);
        setRecipients(recipients.filter((r) => r.id !== id))
    }

    const handleAllocationChange = (id: string | number, value: number) => {
        setConfirmSelection(false)
        const newRecipients = recipients.map((recipient) => {
            if (recipient.id === id) {
                return { ...recipient, allocation: value }
            }
            return recipient
        })
        setRecipients(newRecipients)
    }
    const handleAddUser = (user: any) => {
        setConfirmSelection(false)
        // Check if user is already in recipients
        if (recipients.some((r) => r.type === "farcaster" && r.value === user.value)) {
            return
        }
        const newRecipient: Recipient = {
            id: user.id,
            type: "farcaster",
            value: user.value,
            displayName: user.displayName,
            avatar: user.avatar,
            allocation: allocationType === "equal" ? 100 / (recipients.length + 1) : 0,
            address: user.address
        }
        setRecipients([...recipients, newRecipient])
        setSearchResults([])
    }

    const handleConfirmRecipients = useCallback(async () => {
        if (!fUser) return;
        console.log(recipients)
        const values = recipients.map((recipient) => {
            return {
                recipient: checksumAddress(recipient.address as `0x${string}`),
                allocation_percentage: Math.floor(recipient.allocation * 100)
            }
        });
        try {
            await handle_set_options(fUser.fid, "set_delegated_recipients", values);
            setRecipientsConfirmedLoading(false)
            toast("Recipients confirmed")
        } catch (e: any) {
            console.error(e.message);
        }
    }, [recipients, fUser]);

    const clearRecipients = () => {
        setRecipients([]);
    }

    return (
        <RecipientsContext.Provider value={{
            allocationType,
            confirmSelection,
            connectedWallets,
            errors,
            isSearching,
            recipients,
            recipientType,
            searchResults,
            selectedWallet,
            recipientsConfirmedLoading,
            clearRecipients,
            handleSetRecipientsConfirmedLoading,
            handleConfirmRecipients,
            handleSearch,
            handleAddWallet,
            handleRemoveRecipient,
            handleAllocationChange,
            handleAddUser,
            handleSetRecipientsType,
            handleSetAllocationType,
            handleSetSelectedWallet
        }}>
            {children}
        </RecipientsContext.Provider>
    );
};

export default React.memo(RecipientsProvider)