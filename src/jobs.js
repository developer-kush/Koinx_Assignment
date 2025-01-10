const axios = require('axios');
const Crypto = require('./models/Crypto');

/**
 * Fetches cryptocurrency data for Bitcoin, Matic, and Ethereum from CoinGecko API.
 * Attempts to fetch and store data in the database up to 3 times if an error occurs.
 *
 * @param {number} retries - Number of retries remaining (default is 3).
 * @returns {Promise<void>} Resolves when the data is successfully fetched and stored.
 */
const fetchCryptoData = async (retries = 3) => {
  const coins = ['bitcoin', 'matic-network', 'ethereum'];
  
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
    );

    const records = coins.map((coin) => ({
      coin,
      price: data[coin].usd,
      marketCap: data[coin].usd_market_cap,
      change24h: data[coin].usd_24h_change,
    }));

    await Crypto.insertMany(records);
    console.log('Crypto data fetched and stored successfully.');
  } catch (err) {
    if (retries > 0) {
      console.log(`Error fetching crypto data: ${err.message}. Retrying... (${retries} retries left)`);
      await fetchCryptoData(retries - 1);  // Retry the function
    } else {
      console.error('Error fetching crypto data after 3 retries:', err.message);
    }
  }
};

module.exports = fetchCryptoData;
