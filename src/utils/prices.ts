import axios from 'axios';

export async function fetchTokenPrices(mints: string[]): Promise<{ [key: string]: number }> {
  const prices: { [key: string]: number } = {};

  try {
    const jupiterResponse = await axios.get('https://api.jup.ag/price/v2', { params: { ids: mints.join(',') } });
    Object.entries(jupiterResponse.data.data || {}).forEach(([mint, data]: [string, any]) => {
      const price = (data?.price) || 0;
      if (price > 0) {
        prices[mint] = price;
      }
    });
  } catch (error) {
    console.error('Error fetching prices from Jupiter:', error);
  }

  const remainingMints = mints.filter(mint => !prices[mint]);
  if (remainingMints.length > 0) {
    try {
      const raydiumResponse = await axios.get('https://api.raydium.io/v2/main/price');
      remainingMints.forEach(mint => {
        if (raydiumResponse.data[mint]) {
          prices[mint] = raydiumResponse.data[mint];
        }
      });
    } catch (error) {
      console.error('Error fetching prices from Raydium:', error);
    }
  }

  return prices;
} 