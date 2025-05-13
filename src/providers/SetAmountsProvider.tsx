import { CurrencyType } from '@/types';
import React, { createContext, useState, ReactNode, FC, useCallback, useEffect } from 'react';
import { handle_set_options, remove_listener_id } from '@/lib/utils';
import { useFrameContext } from './FrameProdvider';
import { fuse } from 'viem/chains';

interface SetAmountsContextValue {
    amount: string;
    currency: CurrencyType;
    receiveEth: boolean;
    receiveEthLoading: boolean;
    selectedPreset: number | null;
    presetAmounts: Array<number>;
    handleSetAmount: (amount: string) => void;
    handleSetCurrency: (currency: CurrencyType) => void;
    handleSetReceiveEth: (state: boolean) => void;
    handleSetSelectedPreset: (preset: number) => void;
    handleSetReceiveEthLoading: (state: boolean) => void;
}

interface SetAmountsProviderProps {
    children: ReactNode;
}

export const SetAmountsContext = createContext<SetAmountsContextValue | undefined>(undefined);

export const useSetAmounts = (): SetAmountsContextValue => {
    const context = React.useContext(SetAmountsContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyProvider');
    }
    return context;
};

const presetAmounts = [5, 10, 50, 100]

export const SetAmountsProvider: FC<SetAmountsProviderProps> = ({ children }) => {
    const [amount, setAmount] = useState<string>("")
    const [currency, setCurrency] = useState<CurrencyType>("ETH")
    const [receiveEth, setReceiveEth] = useState<boolean>(false);
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const [receiveEthLoading, setReceiveEthLoading] = useState<boolean>(false);
    const { fUser } = useFrameContext();


    useEffect(() => {
        if (currency === "ETH") {
            remove_listener_id();
        }
    }, [currency]);

    useEffect(() => {
        if (!fUser) return
        const load = async () => {
            try {
                if (receiveEth) {
                    await handle_set_options(fUser.fid, "receive_eth", true);
                    setReceiveEthLoading(false)
                }
            } catch (e: any) {
                console.error(e.message)
            }
        }
        if (amount) load()
    }, [receiveEth, fUser, amount]);


    const handleSetAmount = useCallback((amount: string) => {
        setAmount(amount);
    }, []);

    const handleSetCurrency = useCallback((currency: CurrencyType) => {
        setCurrency(currency);
    }, [])

    const handleSetReceiveEth = useCallback(async (state: boolean) => {
        if (!fUser) return;
        if (state) {
            // make api call to set options;
        }
        setReceiveEth((prev_value) => {
            if (prev_value && !state) {
                handle_set_options(fUser?.fid, "receive_eth", false);
            }
            return state
        });
    }, [fUser])

    const handleSetSelectedPreset = useCallback(async (preset: number) => {
        setSelectedPreset(preset);
        setAmount(preset.toString());
    }, []);

    const handleSetReceiveEthLoading = useCallback((state: boolean) => {
        setReceiveEthLoading(state);
    }, []);

    return (
        <SetAmountsContext.Provider value={{
            amount,
            currency,
            receiveEth,
            receiveEthLoading,
            selectedPreset,
            presetAmounts,
            handleSetAmount,
            handleSetCurrency,
            handleSetReceiveEth,
            handleSetSelectedPreset,
            handleSetReceiveEthLoading
        }}>
            {children}
        </SetAmountsContext.Provider>
    );
};
