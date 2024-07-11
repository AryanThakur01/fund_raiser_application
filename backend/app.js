const express = require('express');
const { ethers } = require('ethers');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const {getTransactionHistory} = require('./controllers/history');
require('dotenv').config();

const app = express();

app.use(express.json());


app.get('/api/balance/', async (req, res) => {
    try {
        const address = process.env.ADDRESS;
        const balance = await provider.getBalance(address);
        res.json({ balance: ethers.formatEther(balance)});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the balance'});
    }
});

app.get('/api/payment-history/', async (req, res) => {
    try {
        const address = process.env.ADDRESS;
        const history = await getTransactionHistory(address, process.env.ETHERSCAN_API_KEY);
        res.json({ history });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the payment history'});
    }
});

app.post('/api/transaction/', async (req, res) => {
    try {
        const { to, value } = req.body;
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const transaction = await signer.sendTransaction({
            to: to,
            value: ethers.parseEther(value)
        });
        await transaction.wait();
        res.json({ message: 'Transaction sent successfully of value: ' + value + ' to address: ' + to});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while sending the transaction'});
    }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

let provider;

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        app.listen(port, () => {
            provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_ID}`);
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};
    
start();
