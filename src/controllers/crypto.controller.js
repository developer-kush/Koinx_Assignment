const Crypto = require('../models/Crypto');
const errors = require('http-errors');

module.exports = {

    /**
   * Fetches the latest statistics (price, market cap, 24-hour change) of the specified cryptocurrency.
   * Responds with the data if available, otherwise throws an error.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>} - Sends a JSON response with the latest data or an error response.
   */
  getStats: async (req, res, next) => {
    try {
      const { coin } = req.params;
      if (!coin) throw new errors.BadRequest('Coin path parameter is required.');

      const latestRecord = await Crypto.findOne({ coin }).sort({ timestamp: -1 });
      if (!latestRecord) throw new errors.NotFound('Data not found for the specified coin.');

      res.json({
        price: latestRecord.price,
        marketCap: latestRecord.marketCap,
        '24hChange': latestRecord.change24h,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Calculates and returns the standard deviation of the price of the specified cryptocurrency 
   * over the last 100 records stored in the database.
   * Responds with the deviation value or an error if there is insufficient data.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function for error handling.
   * @returns {Promise<void>} - Sends a JSON response with the deviation or an error response.
   */
  getDeviation: async (req, res, next) => {
    try {
      const { coin } = req.params;
      if (!coin) throw new errors.BadRequest('Coin path parameter is required.');

      const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);
      if (records.length < 2) throw new errors.BadRequest('Not enough data for deviation calculation.');

      const prices = records.map((record) => record.price);
      const mean = prices.reduce((sum, val) => sum + val, 0) / prices.length;
      const variance = prices.reduce((sum, val) => sum + (val - mean) ** 2, 0) / prices.length;
      const deviation = Math.sqrt(variance);

      res.json({ deviation: parseFloat(deviation.toFixed(2)) });
    } catch (err) {
      next(err);
    }
  }
  
};
