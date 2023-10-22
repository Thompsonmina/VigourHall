import { getUsers, getUserDetails, createNewUser } from "./contract";
import { notification, getUserInfo, storeUserInfo } from "./utils";
import { generateUserSecureHash } from "./encrypt";

const ethers = require("ethers")

export async function isLoggedIn(bool) {
    if (getUserInfo() === null || getUserInfo().username === null) {
        bool = false
    }
    else {
        bool = true
    }
    return bool;
}

export async function logout() {
    storeUserInfo(null, null)
    location.reload()
}

// Create the new user on scroll after generating thier unique hash
// this is the core driving mechanic for making the dapp address agnostic to an extent
export async function signup(provider, signer, username, mnemonicPhrase){
    console.log(username, "signup")
    let usernames = await getUsers(provider)

    if (usersContainUser(usernames, username)) {
        notification("Username already exists. Please choose another one.", true, 5000)
    }
    else {
        let secure_hash = generateUserSecureHash(mnemonicPhrase)
        console.log(secure_hash, "secure_hash")
        await createNewUser(signer, username, secure_hash)
        notification("You have successfully signed up. Please login to continue.", false, 5000)
    }
}

// login the user by ensurin    g thier username matches the address they are using
export async function login(provider, username,  current_address){
    console.log(username, "login")

    let usernames = await getUsers(provider)
    if (!usersContainUser(usernames, username)) {
        notification("Username does not exist. Please sign up to continue.", true, 5000)
    }
    else if (!isValidUsername(username)) {
        notification("Username is not valid. Please try again. It has be at least 3 characters long", true, 5000)
    }
    else {
        let user_details = await getUserDetails(provider, username)
        
        console.log(username, current_address, user_details.address, "login")
        if (String(current_address).toLowerCase() != user_details.address.toLowerCase()) {
            notification("Username is not associated to the currently connected account. Please try again.", true, 5000)
        }
        else {
            notification("You have successfully logged in.", false, 5000)
            storeUserInfo(username, current_address)
        }
    }

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

export function usersContainUser(usernames, targetUsername) {
    return usernames.some(username =>
        username === targetUsername
    );
}

// function usersContainsUser(targetAddress, targetUsername, just_address = false) {
//     if (just_address) {
//         users = get_users();
//         return users.some(([address, username]) =>
//             address === targetAddress
//         );
        
//     }
//     else {
//         users = get_users();
//         return users.some(([address, username]) =>
//             address === targetAddress && username === targetUsername
//         );
//     }
// }

export function isValidUsername(username) {
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