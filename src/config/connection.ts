import { Connection } from '@solana/web3.js'
import { getRandomEndpoint } from './endpoints'

export const getConnection = () => {
  return new Connection(getRandomEndpoint(), 'confirmed')
} 