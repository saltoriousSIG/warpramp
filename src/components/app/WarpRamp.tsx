//import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import SimpleTab from "./SimpleTab"
import AdvancedTab from "./AdvancedTab"
import SettingsTab from "./SettingsTab"
import { Button } from "@/components/ui/button"
import { Loader, FrameIcon } from "@/components/core/icons"
import { useFrameContext } from "@/providers/FrameProdvider"


interface WarpRampProps { }

const WarpRamp: React.FC<WarpRampProps> = ({ }) => {

    // useEffect(() => {
    //     // Get search params from the current URL
    //     const searchParams = new URLSearchParams(window.location.search);
    //     // Access individual params
    //     const state = searchParams.get('state'); // e.g., "bar"
    //     console.log(state)
    // }, []);

    const {
        fUser,
        account,
        contractAddress,
        contractLoaded,
        isFrameAdded,
        isFrameAdding,
        handleAddFrame,
        handleSetIsFrameAdding
    } = useFrameContext();

    if (!fUser) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
            {!isFrameAdded && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="w-[95%] m-auto mb-5"
                >
                    <Button
                        onClick={() => {
                            handleSetIsFrameAdding(true);
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md h-screen"
            >
                <Card className="overflow-hidden border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] gap-0 pt-0">

                    <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 pb-4 pt-6 text-white outfit">
                        <CardTitle className="font-display text-2xl font-bold tracking-tight text-shadow">
                            Warp Ramp
                        </CardTitle>
                        <CardDescription className="text-white">
                            Add funds to your warplet
                        </CardDescription>
                    </CardHeader>

                    <Tabs defaultValue="simple" className="w-full" onValueChange={() => {
                    }}>
                        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 px-6 pb-6">
                            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm outfit">
                                <TabsTrigger
                                    value="simple"
                                    className="font-display data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                                >
                                    Simple
                                </TabsTrigger>
                                <TabsTrigger
                                    value="advanced"
                                    className="font-display data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                                >
                                    Advanced
                                </TabsTrigger>
                                <TabsTrigger
                                    value="settings"
                                    className="font-display data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                                >
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <CardContent className="p-0 jakarta">
                            <AnimatePresence mode="wait">
                                <TabsContent key="simple" value="simple" className="mt-0">
                                    <SimpleTab account={account} contractAddress={contractAddress} contractLoaded={contractLoaded} />
                                </TabsContent>
                                <TabsContent key="advanced" value="advanced" className="mt-0">
                                    <AdvancedTab contractAddress={contractAddress} contractLoaded={contractLoaded} />
                                </TabsContent>
                                <TabsContent key="settings" value="settings" className="mt-0">
                                    <SettingsTab fid={fUser.fid} contractAddress={contractAddress} />
                                </TabsContent>
                            </AnimatePresence>
                        </CardContent>
                    </Tabs>
                </Card>
            </motion.div>
        </div>
    )
}


export default WarpRamp;