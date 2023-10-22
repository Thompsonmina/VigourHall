const ethers = require("ethers")

export const delay = ms => new Promise(res => setTimeout(res, ms));

export function format_to_wei(num) {
    return ethers.BigNumber.from(num * 100000).mul(1e13);
}

export async function notification(_text, self_destruct = true, wait=1000) {
    document.querySelector(".alert-container").classList.toggle("hidden");
    document.querySelector("#notification").textContent = _text

    if (self_destruct === true) {
        console.log(_text)

        await delay(wait);
        notificationOff()
    }
}

export function notificationOff() {
    document.querySelector(".alert-container").classList.add("hidden")
}

export function convertIterableToMap(key, arrayOfObjects) {
    let newObject = {};
    for (let obj of arrayOfObjects) {
        newObject[obj[key]] = obj;
    }
    return newObject;
}

export function hideModal(id) {
    const body = document.querySelector("body")
    body.classList.toggle("overflow-hidden");

    const modal = document.getElementById(id);
    if (! modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }
}
  
export function showModal(id) {
    const body = document.querySelector("body")
    console.log(body)
    body.classList.toggle("overflow-hidden");

    const modal = document.getElementById(id);
    console.log(modal, "modal")
    modal.classList.remove('hidden');
    
}

export function storeFitbitCredentials(state = null, code_verifier = null, access_token = null, challenge_type = "", store_data = false, mnemonic_phrase="") {
    const storeddata = { state, code_verifier, access_token, challenge_type, store_data, mnemonic_phrase};
    localStorage.setItem("fitbit_info", JSON.stringify(storeddata));
}

export function storeUserInfo(username, address) {
    const storeddata = { username, address};
    localStorage.setItem("user_info", JSON.stringify(storeddata));
}

export function getUserInfo() {
    const storeddata = localStorage.getItem("user_info");
    console.log(storeddata, "stored data")
    return JSON.parse(storeddata);
}

export function getFitbitCredentials() { 
    const storeddata = localStorage.getItem("fitbit_info");
    console.log(storeddata, "stored data")
    return JSON.parse(storeddata);
}
