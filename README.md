# DeFiP: Simplify Your DeFi Portfolio Management

DeFiP is your personal, all-in-one DeFi portfolio tracker designed for simplicity and efficiency. Built on the Solana blockchain, DeFiP empowers you to:

- **Connect Your Wallet**: Seamlessly integrate your digital wallet for real-time portfolio management.
- **Track Performance**: Get a comprehensive view of your cryptocurrency investments, including real-time asset values.
- **Monitor Gains & Losses**: Understand your portfolio's performance at a glance with intuitive metrics and analytics.
- **Enhanced Security**: Enjoy peace of mind with a secure platform leveraging the robust capabilities of the Solana blockchain.
- **Cross-Chain Support**: Now integrated with bitsCrunch APIs to fetch real-time DeFi and token analytics from multiple blockchains.
- **Future Network Support**: Plans to expand support for additional blockchain networks in future updates.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)
- bitsCrunch API Key (Get one at [UnleashNFTs](https://unleashnfts.com))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/italiancode/DeFi-P.git
cd defi-p
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your configuration:

```env
NEXT_PUBLIC_NODE_RPC_URL=https://mainnet.helius-rpc.com/?api-key=
NEXT_PUBLIC_NODE_API_KEY=e0fa5bb9-0c67-4ac2-8840-9db164b443d7
NEXT_PUBLIC_BITSCRUNCH_API_KEY=your-bitscrunch-api-key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button.
2. Your portfolio will automatically load and display your assets.
3. Track your investments and monitor performance in real-time.
4. View additional token analytics and DeFi insights from bitsCrunch APIs.

## Built With

- [Next.js](https://nextjs.org/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [bitsCrunch APIs](https://unleashnfts.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

