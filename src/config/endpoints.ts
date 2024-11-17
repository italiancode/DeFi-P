export const RPC_ENDPOINTS = [
  'https://solana-mainnet.core.chainstack.com/',
  // Add alternative endpoints here
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com'
]

export const getRandomEndpoint = () => {
  return RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)]
} 