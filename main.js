const sha256 = require('crypto-js/sha256');

class Tranaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block {
    constructor(timestamp, transaction, previousHash = '') {
      
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.nonce = 0
        this.hash = '';
    }

    calculateHash() {
        return sha256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + " " + this.hash)
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("03/14/2018", "Genesis block", "0");

    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    minePendingTransaction(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully mined');
        this.chain.push(block);

        this.pendingTransaction = [
            new Tranaction(null, miningRewardAddress, this.miningReward)
        ]
        console.log(this.pendingTransaction, 'the pending transaction');
    }

    createTransaction(transaction) {
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            console.log(block, 'the block')
            for(const trans of block.transaction) {
                console.log(trans, 'the trans')
                if(trans.fromAddress === address) {
                    console.log(trans.amount)
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false
            }

        }
        return true;
    }
}

let julioCoin = new BlockChain();
julioCoin.createTransaction(new Tranaction('julio-address', 'address2', 100))
julioCoin.createTransaction(new Tranaction('address2', 'julio-address', 500))

console.log('\n Starting miner...')
julioCoin.minePendingTransaction('julios-address')
console.log('\nBalance of julio is ', julioCoin.getBalanceOfAddress('julio-address'));

console.log('\n Starting miner...')
julioCoin.createTransaction(new Tranaction('address2', 'julio-address', 500))
julioCoin.minePendingTransaction('julios-address')
julioCoin.createTransaction(new Tranaction('julio-address', 'someone', 500))
console.log('\nBalance of julio is ', julioCoin.getBalanceOfAddress('julio-address'));

// console.log('mining block 1 ...');
// julioCoin.addBlock(new Block(1, "03/15/2018", {amount: 4}));
// console.log('mining block 2 ...');
// julioCoin.addBlock(new Block(2, "03/18/2018", {amount: 14}));

// console.log(JSON.stringify(julioCoin, null, 4))
// console.log('is JulioCoin valid ?' + " " +julioCoin.isChainValid());

// julioCoin.chain[1].data = { amount: 100};
// julioCoin.chain[1].hash = julioCoin.chain[1].calculateHash();
// console.log('is JulioCoin valid ?' + " " +julioCoin.isChainValid());