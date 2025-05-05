# Farcaster Mini App - NFT Mint

A simple Farcaster mini app for minting an NFT. This app is built with Vite, React, TypeScript, and wagmi.

## Overview

This mini app demonstrates how to create a simple NFT minting experience within a Farcaster Frame. It uses:

- Vite for fast development
- React for UI
- TypeScript for type safety
- wagmi for Web3 wallet connections
- Farcaster Frame SDK for frame integration

## Features

- Simple configuration for your own NFT collection
- Connect Farcaster wallet via Frame
- Mint an NFT directly in the frame
- Success and error handling
- Share functionality

## Getting Started

1. Clone this repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`
4. Open your browser to the URL shown in the terminal

## Configuration

To configure the mini app for your own NFT collection, edit the `src/config.ts` file. You'll need to set:

- Collection name and description
- Image URL for the NFT
- Creator details
- Chain and pricing information
- Mint timing settings

You'll also need to update the contract address and ABI in `src/contracts.ts`.

## Frame Embed

The Farcaster Frame meta tag is defined in `index.html`. Before deploying your app, update this tag with your actual deployment URL:

```html
<head>
  <!-- other tags -->
  <meta name="fc:frame" content='{"version":"next","imageUrl":"/placeholder-nft.png","button":{"title":"Open","action":{"type":"launch_frame","name":"NFT Mint","url":"https://your-app-url.com"}}}' /> 
</head>
```

If you change your NFT image or name in the config, be sure to update this tag as well to keep them in sync.

## License

MIT