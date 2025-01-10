# KoinX Backend Intern Assignment

This project is created as part of the Backend Intern Assignment requirement for **KoinX**.

## Overview

The project fetches cryptocurrency data for three coins (Bitcoin, Matic, and Ethereum) from the [CoinGecko API](https://www.coingecko.com/). It stores the fetched data in a MongoDB database and provides two main API endpoints:

1. **`/stats/:coin`** - Fetches the latest data (price, market cap, and 24h change) of the requested cryptocurrency.
2. **`/deviation/:coin`** - Calculates the standard deviation of the price of the requested cryptocurrency from the last 100 records stored in the database.

Additionally, the project uses a cron job to fetch and store the cryptocurrency data every two hours.

## Features

- **Fetch Cryptocurrency Data:** Retrieves price, market cap, and 24h change for Bitcoin, Matic, and Ethereum from the CoinGecko API.
- **Data Storage:** Saves fetched data in a MongoDB database.
- **API Endpoints:**
  - **`GET /stats/:coin`**: Returns the latest data (price, market cap, 24h change) of the specified coin.
  - **`GET /deviation/:coin`**: Returns the standard deviation of the last 100 records for the specified coin.
- **Background Task:** A cron job that fetches the latest data every 2 hours.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/koinx-backend-intern-assignment.git
   cd koinx-backend-intern-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:
   ```
   MONGO_URI=<your_mongodb_connection_string>
   CRYPTO_SCHEDULE="0 */2 * * *"  # Runs every 2 hours
   PORT=5000
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. The app will be available at `http://localhost:5000`.

## API Endpoints

### 1. **`GET /stats/:coin`**

Fetch the latest data (price, market cap, and 24h change) of the specified cryptocurrency.

#### Parameters:
- `coin` (Path Parameter): The cryptocurrency name (`bitcoin`, `matic`, or `ethereum`).

#### Example Request:
```bash
GET /api/stats/bitcoin
```

#### Example Response:
```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

---

### 2. **`GET /deviation/:coin`**

Calculate the standard deviation of the last 100 price records for the specified cryptocurrency.

#### Parameters:
- `coin` (Path Parameter): The cryptocurrency name (`bitcoin`, `matic`, or `ethereum`).

#### Example Request:
```bash
GET /api/deviation/bitcoin
```

#### Example Response:
```json
{
  "deviation": 4082.48
}
```

## License

This project is open-source and available under the MIT License.