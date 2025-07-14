[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/rsksmart/rsk-thirdweb-marketplace/badge)](https://scorecard.dev/viewer/?uri=github.com/rsksmart/rsk-thirdweb-marketplace)
[![CodeQL](https://github.com/rsksmart/rsk-thirdweb-marketplace/workflows/CodeQL/badge.svg)](https://github.com/rsksmart/rsk-thirdweb-marketplace/actions?query=workflow%3ACodeQL)

<img src="rootstock-logo.png" alt="RSK Logo" style="width:100%; height: auto;" />

# Rootstock NFT Marketplace

NFT marketplace built on Rootstock using thirdweb.

## Features

- NFT listing grid with responsive layout and loading skeletons
- Detailed NFT view with listing information
- Buy and cancel functionality powered by thirdweb's marketplace extensions

Built using the [thirdweb Marketplace SDK](https://portal.thirdweb.com/references/typescript/v5/marketplace), which provides a clean API surface for marketplace operations, allowing us to focus on the user experience rather than low-level smart contract calls.

## Installation & Development

1. **Clone and setup**:
   ```sh
   git clone https://github.com/rsksmart/rsk-thirdweb-marketplace.git
   cd rsk-thirdweb-marketplace
   bun install
   ```

2. **Configure environment**:
   Rename a `.env.example` file in the root directory using `mv .env.example .env.local` and follow the guide to replace the needed variables.

   > **⚠️ IMPORTANT**: When using Rootstock Testnet, ensure that `NEXT_PUBLIC_MARKETPLACE_CONTRACT` is in lowercase format. Rootstock testnet addresses are not checksummed, so the contract address must be lowercase to work properly.


3. **Start development server**:
   ```sh
   bun run dev
   ```

4. **Access the application**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Development](#installation--development)
- [Usage](#usage)
- [Contributing](#contributing)
- [Support](#support)

## Overview

The NFT Marketplace consists of two main processes:

1. **Buy an NFT**: Users can buy NFTs connecting their wallets. Once the users sign the buy transaction and pay for the NFT and gas costs, they own the NFT.
2. **Sell an NFT**: Users can list their NFTs and establish the price they want for them individually. To list an NFT, they must specified the address of the ERC1155 NFT representation on the Rootstock (RSK) network, the token ID and the price.

## Technologies Used

- **Thirdweb Marketplace V3**: [Thirdweb Documentation](https://thirdweb.com/thirdweb.eth/MarketplaceV3)
- **Thirdweb TS SDK**: [Thirdweb Github](https://github.com/thirdweb-dev/js/tree/main#readme)


## Project Structure

```
├── app/
│   ├── assets/
│   ├── utils/
│   ├── config.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── footer/
│   ├── icons/
│   ├── navbar/
│   ├── ui/
│   ├── NFTDetailSheet.tsx
│   ├── NFTCard.tsx
│   ├── NFTGrid.tsx
│   ├── NFTSkeleton.tsx
│   └── SellSheet.tsx
```

## Usage

1. **Sell an NFT**: Navigate to the Sell tab, fill out the form, and submit to list an NFT on the marketplace.
2. **Buy an NFT**: Click on the NFT you are interested in, connect your wallet, click on Buy, sign the transaction and enjoy your NFT.

## Contributing

We welcome contributions from the community. Please fork the repository and submit pull requests with your changes. Ensure your code adheres to the project's main objective.

## Support

For any questions or support, please open an issue on the repository or reach out to the maintainers.

# Disclaimer

The software provided in this GitHub repository is offered "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.

- **Testing:** The software has not undergone testing of any kind, and its functionality, accuracy, reliability, and suitability for any purpose are not guaranteed.
- **Use at Your Own Risk:** The user assumes all risks associated with the use of this software. The author(s) of this software shall not be held liable for any damages, including but not limited to direct, indirect, incidental, special, consequential, or punitive damages arising out of the use of or inability to use this software, even if advised of the possibility of such damages.
- **No Liability:** The author(s) of this software are not liable for any loss or damage, including without limitation, any loss of profits, business interruption, loss of information or data, or other pecuniary loss arising out of the use of or inability to use this software.
- **Sole Responsibility:** The user acknowledges that they are solely responsible for the outcome of the use of this software, including any decisions made or actions taken based on the software's output or functionality.
- **No Endorsement:** Mention of any specific product, service, or organization does not constitute or imply endorsement by the author(s) of this software.
- **Modification and Distribution:** This software may be modified and distributed under the terms of the license provided with the software. By modifying or distributing this software, you agree to be bound by the terms of the license.
- **Assumption of Risk:** By using this software, the user acknowledges and agrees that they have read, understood, and accepted the terms of this disclaimer and assumes all risks associated with the use of this software.
