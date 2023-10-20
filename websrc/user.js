// import { get_users } from "./contract";

const ethers = require("ethers")

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

export async function get_username() {
    return "tom"
}

export function isValidEthereumAddress(address) {
    let error_message = "";
    let is_valid = true
    try {
        ethers.utils.getAddress(address);
    } catch {
        is_valid = false;
        return false;
    }

    return {error_message, is_valid}
}


function usersContainsUser(targetAddress, targetUsername, just_address = false) {
    if (just_address) {
        users = get_users();
        return users.some(([address, username]) =>
            address === targetAddress
        );
        
    }
    else {
        users = get_users();
        return users.some(([address, username]) =>
            address === targetAddress && username === targetUsername
        );
    }
}

export function isValidUsername(username, address) {
    let error_message = "";
    let is_valid = true
    if (username.length < 3 || username === "") {
        error_message = "Username cannot be blank must be at least 3 characters long."
        is_valid = false
    }
    
    return {error_message, is_valid}
}

export function isValidForLogin(username, address) {
    let error_messages = [];
    let is_valid = false
    if (!isValidUsername(username, address).is_valid) {
        error_messages.push(isValidUsername(username, address).error_message)
    }
    if (usersContainsUser(username)) {
        error_messages.push("This username does not seem to be your address.")
    }
    if (error_messages.length === 0) {
        is_valid = true
    }
    return {error_messages, is_valid}
}

export function isValidForSignUp(username, address) {
    let error_messages = [];
    let is_valid = false
    if (!isValidUsername(username, address).is_valid) {
        error_messages.push(isValidUsername(username, address).error_message)
    }
    if (!usersContainsUser(address, username, just_address = true)){
        error_messages.push("This address is already associated to a user.")
    }
    if (error_messages.length === 0) {
        is_valid = true
    }
    return {error_messages, is_valid}
}