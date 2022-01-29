const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
  constructor(timestamp, transaction, previewhash = ''){
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previewhash = previewhash;
    this.hash = this.createHash();
    this.nonce = 0;
  }

  createHash(){
    return SHA256(this.index + this.previewhash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
      this.nonce++;
      this.hash =this.createHash();
    }

    console.log(this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.setGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }

  setGenesisBlock(){
    return new Block(0, "01/01/2022", "FirstBlock", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingtransaction(miningRewardAddress){
     let block = new Block(Date.now, this.pendingTransaction);
     block.mineBlock(this.difficulty);

     console.log("Block Successfully Mined...");
     this.chain.push(block);

     this.pendingTransaction = [
         new Transaction(null, miningRewardAddress, this.miningReward)
     ]
  }

  createTransaction(transaction){
      this.pendingTransaction.push(transaction);
  }

  getBalanceOfAddress(address){
      let balance = 0;
      for(const block of this.chain){
          for(const trans of block.transaction){
              if(trans.fromAddress === address){
                  balance -= trans.amount;
              }

              if(trans.toAddress === address){
                  balance += trans.amount;
              }
          }
      }

      console.log(`${address} balance: ${balance}`);
  }

  isValidChain(){
    for(let i=1; i<this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.createHash()){
        return false;
      }

      if(currentBlock.previewhash !== previousBlock.hash){
        return false;
      }
    }

    return true;
  }
}

let devCoin = new Blockchain();
console.log("Create transaction 1");
devCoin.createTransaction(new Transaction("address-1", "address-3", 100));

console.log("Create transaction 2");
devCoin.createTransaction(new Transaction("address-2", "address-1", 1000));

console.log("Create transaction 3");
devCoin.createTransaction(new Transaction("address-3", "address-2", 2000));


console.log("Start Mining ...");
devCoin.minePendingtransaction('address-4');
devCoin.minePendingtransaction('address-4');
devCoin.minePendingtransaction('address-4');

devCoin.getBalanceOfAddress('address-4');

console.log("Start Mining ...");
devCoin.minePendingtransaction('address-5');

devCoin.getBalanceOfAddress('address-4');
