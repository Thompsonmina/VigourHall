
const ethers = require("ethers")
const CryptoJS = require('crypto-js');

const { HDNodeWallet } = require('ethers') 


const stringToBytes = (str) => {
    const encoder = new TextEncoder();  // TextEncoder is available in most modern browsers
    return encoder.encode(str);
}
  
export function generate_mnemonic() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic;
    return mnemonic.phrase;
}

export function generateUserSecureHash(mnemonic_phrase){
    const user_secure_hash = ethers.keccak256(stringToBytes(ethers.keccak256(stringToBytes(mnemonic_phrase))));
    return user_secure_hash;
}

export function deriveKeyFromMnemonic(mnemonic) {
    // Create a wallet instance from the mnemonic

    const wallet = HDNodeWallet.fromPhrase(mnemonic);
    // Derive a symmetric key for encryption.
    // For this example, we'll use the private key of the wallet.
    // We'll then hash it to get a 32-byte key suitable for AES encryption.
    const key = ethers.keccak256(wallet.privateKey).slice(2, 66); // remove the "0x" prefix and get 32 bytes
    return key;
}

export function encrypt(data, mnemonic) {
    const key = deriveKeyFromMnemonic(mnemonic);
    const ciphertext = CryptoJS.AES.encrypt(data, key.toString(CryptoJS.enc.Hex)).toString();
    console.log(ciphertext, "inside encrypt");
    return ciphertext;
}

export function decrypt(ciphertext, mnemonic) {
    const key = deriveKeyFromMnemonic(mnemonic);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key.toString(CryptoJS.enc.Hex));
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}