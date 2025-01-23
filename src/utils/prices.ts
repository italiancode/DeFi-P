import axios from 'axios';

interface JupiterData {
  price: number;
  // Add other fields if necessary
}

export async function fetchTokenPrices(mints: string[]): Promise<{ [key: string]: number }> {
  const prices: { [key: string]: number } = {};

  try {
    const jupiterResponse = await axios.get('https://api.jup.ag/price/v2', { params: { ids: mints.join(',') } });
    const dataEntries = jupiterResponse.data.data as Record<string, JupiterData>;
    Object.entries(dataEntries || {}).forEach(([mint, data]) => {
      const price = (data?.price) || 0;
      if (price > 0) {
        prices[mint] = price;
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Rethrow the error after logging
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