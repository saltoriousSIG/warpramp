export const embedConfig = {
  version: "next",
  imageUrl: "https://warpramp.link/image.png",
  button: {
    title: "Fund your Warplet",
    action: {
      type: "launch_frame",
      name: "Warp Ramp",
      url: "https://warpramp.link/",
    },
  },
} as const;

/**
 * Main App Configuration
 */
export const config = {
  embed: embedConfig,
} as const;
