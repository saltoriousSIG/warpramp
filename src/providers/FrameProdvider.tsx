import { createContext, useEffect, useState, useContext, useCallback } from "react";
import sdk, { type FrameHost } from "@farcaster/frame-sdk";
import axios from "axios";

interface FrameContextValue {
    account: string;
    context: FrameHost['context'] | null;
    contractAddress: string;
    contractLoaded: boolean;
    errors: Record<string, Error> | null;
    fUser: FrameHost['context']['user'] | null;
    handleAddFrame: () => Promise<void>;
    handleSetIsFrameAdding: (state: boolean) => void;
    isFrameAdded: boolean;
    isFrameAdding: boolean;
}

const FrameSDKContext = createContext<FrameContextValue | undefined>(undefined);

export function useFrameContext() {
    const context = useContext(FrameSDKContext);
    if (context === undefined) {
        throw new Error("useFrameContext must be used within an FramSDKProvider");
    }
    return context;
}

export function FrameSDKProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<string>("");
    const [context, setContext] = useState<FrameHost['context'] | null>(null);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [contractLoaded, setContractLoaded] = useState<boolean>(false)
    const [errors, setErrors] = useState<Record<string, Error> | null>(null);
    const [fUser, setFUser] = useState<FrameHost['context']['user'] | null>(null);
    const [isFrameAdded, setIsframeAdded] = useState<boolean>(false);
    const [isFrameAdding, setIsFrameAdding] = useState<boolean>(false)

    const handleSetIsFrameAdding = (state: boolean) => setIsFrameAdding(state);

    const handleAddFrame = useCallback(async () => {
        try {
            await sdk.actions.addFrame();
            setIsframeAdded(true);
        } catch (e: any) {
            setErrors({
                ...errors,
                addFrame: new Error("Error adding frame! " + e.message)
            })
        } finally {
            setIsFrameAdding(false)
        }
    }, []);


    useEffect(() => {
        sdk.actions.ready();
    }, []);

    // Load context
    useEffect(() => {
        const load = async () => {
            try {
                const context = await sdk.context;
                setContext(context)
                setFUser(context.user);
                setIsframeAdded(context.client.added);
            } catch (e: any) {
                setErrors({
                    ...errors,
                    load: new Error("You must load this page from within Warpcast!")
                })
            }
        }
        load()
    }, []);

    // get warplet
    useEffect(() => {

        const checkConnectedWallet = async () => {
            try {
                const { data } = await axios.get(`https://api.warpcast.com/fc/primary-address?fid=${fUser?.fid}&protocol=ethereum`);
                setAccount(data.result.address.address);
            } catch (e: any) {
                setErrors({
                    ...errors,
                    warplet: new Error("Error loading warplet " + e.message)
                })

            }
        }
        if (fUser?.fid) checkConnectedWallet();
    }, [fUser]);

    // get proxy address
    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`https://api.warpramp.link/fetch_user_contract?fid=${fUser?.fid}&user_address=${account}&version=v1`)
                const { contract_address } = data;
                setContractAddress(contract_address);
                setContractLoaded(true);
            } catch (e: any) {
                setErrors({
                    ...errors,
                    ramp_address: new Error("Error loading ramp address")
                })
            }
        }
        if (fUser?.fid && account) load();
    }, [fUser, account]);

    return (
        <FrameSDKContext.Provider value={{
            account,
            context,
            contractAddress,
            contractLoaded,
            errors,
            fUser,
            handleAddFrame,
            handleSetIsFrameAdding,
            isFrameAdded,
            isFrameAdding,

        }}>
            {children}
        </FrameSDKContext.Provider>
    );
}