import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface RedirectProps { }

const Redirect: React.FC<RedirectProps> = ({ }) => {
    const { request_id } = useParams();

    useEffect(() => {
        const load = async () => {
            await axios.post("https://warpramp.link/add_transfer_queue", {
                request_id
            });
        }
        load();
        window.location.replace("https://farcaster.xyz/miniapps/IicCFtcNbkXu/warp-ramp")
    }, [request_id]);

    return null
}

export default Redirect;