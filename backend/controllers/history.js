const { EtherscanProvider, ethers } = require('ethers');

class MyEtherscanProvider extends EtherscanProvider {
    constructor(networkish, apiKey) {
        super(networkish, apiKey);
    }

    async getHistory(address, startBlock, endBlock) {
        const params = {
            action: "txlist",
            address: address,
            startblock: (startBlock == null) ? 0 : startBlock,
            endblock: (endBlock == null) ? 99999999 : endBlock,
            sort: "asc"
        };

        const transactions = await this.fetch("account", params);

        if (Array.isArray(transactions)) {
            return transactions.map(tx => ({
                'Transaction Hash': tx.hash,
                'Status': tx.txreceipt_status === '1' ? 'Success' : 'Failed',
                'Timestamp': new Date(tx.timeStamp * 1000).toUTCString(),
                'From': tx.from,
                'To': tx.to,
                'Value': ethers.formatEther(tx.value) + ' ETH', 
                'Transaction Fee': ethers.formatEther(tx.gasPrice * tx.gasUsed) + ' ETH'
            }));
        } else {
            throw new Error('Unexpected API response format');
        }
    }
}

const getTransactionHistory = async (address, apiKey) => {
    const provider = new MyEtherscanProvider('sepolia', apiKey);
    const history = await provider.getHistory(address);
    return history;
}

module.exports = { getTransactionHistory };
