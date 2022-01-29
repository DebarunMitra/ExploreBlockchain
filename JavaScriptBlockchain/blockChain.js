const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error("Invalid Transaction! Don't have transaction access from other wallet.")
        }

        const hashTransaction = this.calculateHash();
        const sig = signingKey.sign(hashTransaction, 'base64');
        this.signature = sig.toDER('hex')
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error("Invalid Signature!")
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature)
        
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

  hasValidTransaction(){
      for(const tx of this.transaction){
          if(!tx.isValid()){
              return false;
          }
      }

      return true;
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
    return new Block(Date.parse('2022-01-22'), [], '0');
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingtransaction(miningRewardAddress){
     let block = new Block(Date.now(), this.pendingTransaction, this.getLatestBlock().hash);
     block.mineBlock(this.difficulty);

     this.pendingTransaction = [
        new Transaction(null, miningRewardAddress, this.miningReward)
    ]

     console.log("Block Successfully Mined...");
     this.chain.push(block);
  }

  addTransaction(transaction){
      if(!transaction.fromAddress || !transaction.toAddress){
          throw Error('Transaction must require From and To address');
      }

      if(!transaction.isValid()){
          throw Error("Can't add invalid transaction");
      }

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

      if(!currentBlock.hasValidTransaction()){
          console.log('1');
          return false;
      }

      if(currentBlock.hash !== currentBlock.createHash()){
        console.log('2');
        return false;
      }

      if(currentBlock.previewhash !== previousBlock.hash){
        console.log('3');
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;