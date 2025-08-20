import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

interface RedirectProps { }

const Redirect: React.FC<RedirectProps> = ({ }) => {
    const [searchParams] = useSearchParams();

    const request_id = searchParams.get("request_id");

    useEffect(() => {
        const load = async () => {
            await axios.post("https://api.warpramp.link/add_transfer_queue", {
                request_id
            });
        }
        load().finally(() => {
            window.location.replace("https://farcaster.xyz/miniapps/IicCFtcNbkXu/warp-ramp")
        });
    }, [request_id]);

    return <></>
}

export default Redirect;