const {Blockchain, Transaction} = require('./blockChain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('345bc725a46ea9a155cbe6a7a5c9c74e51af846c7b8f4c7f7183b8d3907cff29');
const myWalletAddress = myKey.getPublic('hex');

let devCoin = new Blockchain();
console.log("Create transaction 1");
const tnx1 = new Transaction(myWalletAddress, 'other public key', 10);
tnx1.signTransaction(myKey);
devCoin.addTransaction(tnx1);

// console.log("Create transaction 2");
// devCoin.createTransaction(new Transaction("address-2", "address-1", 1000));

// console.log("Create transaction 3");
// devCoin.createTransaction(new Transaction("address-3", "address-2", 2000));

//first mining to complete created transaction
console.log("Start Mining ...");
devCoin.minePendingtransaction(myWalletAddress);
//second mining to complete reward transaction
console.log("Start Mining ...");
devCoin.minePendingtransaction(myWalletAddress);

devCoin.getBalanceOfAddress(myWalletAddress); //balance: 90

console.log(`Is Valid Chain: ${devCoin.isValidChain()}`);

