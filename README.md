# DeFiP: Simplify Your DeFi Portfolio Management

DeFiP is your personal, all-in-one DeFi portfolio tracker designed for simplicity and efficiency. Built on the Solana blockchain, DeFiP empowers you to:

- **Connect Your Wallet**: Seamlessly integrate your digital wallet for real-time portfolio management.
- **Track Performance**: Get a comprehensive view of your cryptocurrency investments, including real-time asset values.
- **Monitor Gains & Losses**: Understand your portfolio's performance at a glance with intuitive metrics and analytics.
- **Enhanced Security**: Enjoy peace of mind with a secure platform leveraging the robust capabilities of the Solana blockchain.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

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
NEXT_PUBLIC_NODE_RPC_URL=your_rpc_url
NEXT_PUBLIC_NODE_API_KEY=your_api_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button
2. Your portfolio will automatically load and display your assets
3. Track your investments and monitor performance in real-time

## Built With

- [Next.js](https://nextjs.org/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
