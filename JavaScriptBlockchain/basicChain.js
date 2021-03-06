const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previewhash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previewhash = previewhash;
    this.hash = this.createHash();
    this.nonce = 0;
  }

  createHash(){
    return SHA256(this.index + this.previewhash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    this.difficulty = 5;
  }

  setGenesisBlock(){
    return new Block(0, "01/01/2022", "FirstBlock", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previewhash = this.getLatestBlock().hash
    // newBlock.hash = newBlock.createHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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
console.log("Create block 1");
devCoin.addBlock(new Block(1, "10/01/2021", {sender: 'John', amount: 1000.0, receiver: 'Doe'}));
console.log("Create block 2");
devCoin.addBlock(new Block(2, "10/01/2021", {sender: 'Aarya', amount: 5000.0, receiver: 'Stark'}));
console.log("Create block 3");
devCoin.addBlock(new Block(3, "10/01/2021", {sender: 'Sansa', amount: 3000.0, receiver: 'Stark'}));

// ----------imp 1------
// console.log(JSON.stringify(devCoin, null, 4));

// console.log(`Coin Validity: ${devCoin.isValidChain()}`);

//change the data of block 1
// devCoin.chain[1].data = {sender: 'John', amount: 100.0, receiver: 'Doe'}
// devCoin.chain[1].hash = devCoin.chain[1].createHash();
// devCoin.chain[1+1].previewhash = devCoin.chain[1].hash;
// console.log(JSON.stringify(devCoin, null, 4));


// console.log(`Coin Validity: ${devCoin.isValidChain()}`);
// ----------imp 1------

