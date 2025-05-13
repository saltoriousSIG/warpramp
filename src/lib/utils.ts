import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { OptionType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function remove_listener_id() {
  const listener_id = localStorage.getItem("listener_id");
  const onrampOpen = localStorage.getItem("onrampOpen");
  if (onrampOpen === "true") return;
  if (listener_id) {
    try {
      const { data } = await axios.get(
        `https://api.warpramp.link/cancel_token_listener?listener_id=${listener_id}`
      );
      console.log(data);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      localStorage.removeItem("listener_id");
    }
  }
}

export async function handle_set_options(
  fid: number,
  action: OptionType,
  value: any
) {
  try {
    const { data } = await axios.post(
      "https://api.warpramp.link/set_tx_options",
      {
        fid,
        options: {
          action,
          value,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
  } catch (e: any) {
  } finally {
  }
}
