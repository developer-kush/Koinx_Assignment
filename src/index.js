require('dotenv').config();
const mongoose = require('mongoose');
const fetchCryptoData = require('./jobs');
const express = require('express');
const cron = require('node-cron');
const errors = require('http-errors');

const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(require('morgan')(process.env.NODE_ENV || 'combined'));
app.use('/api', apiRoutes);

app.use((req, res, next) => {
  next(errors.NotFound('Route not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});

if (process.env.CRYPTO_SCHEDULE){
    cron.schedule(process.env.CRYPTO_SCHEDULE || "0 */2 * * *" , fetchCryptoData);
}

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected...');
    app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
    fetchCryptoData();
}).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});