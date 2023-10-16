const ethers = require("ethers")
const bip39 = require('bip39')

export async function isLoggedIn(bool = false) {
    return bool;
}

export async function logout() {
    return true;
}

export function generate_mnemonic() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic;
    return mnemonic.phrase;
}

