// import timely_tasks_artefacts from '../out/tasks.sol/Tasks.json'
import { notification, notificationOff, format_to_wei, convertIterableToMap, delay } from "./utils";
import { generate_auth_url, get_access_token, SCOPES } from "./fitbit";

const ethers = require("ethers")
import { MetaMaskSDK } from '@metamask/sdk';

import './styles.css';

console.log("I am not crazy")

const MMSDK = new MetaMaskSDK();
console.log(MMSDK)
await MMSDK.init()
ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

console.log("Sdk issues?", ethereum)
let signer;
let provider;
let current_address;
let contract;

function closeBanner() {
    document.getElementById('banner').style.display = 'none';
    document.getElementById('all_content').classList.remove('hidden');
  }


const connectMetaMaskWallet = async function () {
    if (ethereum.isMetaMask) {
        
        await notification("⚠️ Please approve this DApp to use it.")
        try {
            let accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
            current_address = accounts[0];
            console.log(current_address);
        }
        catch (error) {
            console.error(error);
        }
        console.log("approved")
        try {
            
                provider = new ethers.BrowserProvider(
                ethereum,
                "any"
            );
            console.log("here?");
            
            signer = await provider.getSigner();
            console.log("passed finder")
           
        }
        catch (error) {
            await notification(`⚠️ ${error}.`)
            console.error(error);
        }
    }
    else {
        await notification("⚠️ Please install Metamask.")
        console.log("Please install Metamask.");
    }
}


// const getEthBalance = async function (address) {
//     let balance = await erc20_contract.balanceOf(address)
//     balance = ethers.utils.formatEther(balance);
//     return balance
// }



// Top level event listeners

 // MetaMask event listeners
//  ethereum.on("chainChanged", handleNewNetwork);
 ethereum.on("accountsChanged", () => {
     window.location.reload();
 });

document.getElementById('connect-btn').addEventListener('click', connectMetaMaskWallet);
document.getElementById('fitbit-btn').addEventListener('click', async () => {

    let { url, code_verifier, state } = await generate_auth_url(SCOPES);
    console.log("fitbit button clicked")
    console.log(url, "auth url")
    console.log("why twice")
    await notification("⌛ Loading Fitbit authorization page...");

    setTimeout(function() {
        window.location.href = url;
    }, 2000);

    storeFitbitCredentials(state, code_verifier, null, "")
    // read message and execute the actual function

}
);

function storeFitbitCredentials(state = null, code_verifier = null, access_token = null, method = "") {

    const storeddata = { state, code_verifier, access_token, method };
    localStorage.setItem("fitbit_info", JSON.stringify(storeddata));
}

function getFitbitCredentials() { 
    const storeddata = localStorage.getItem("fitbit_info");
    return JSON.parse(storeddata);
}

// https://thompsonmina.github.io/VigourHall/?code=5cfc20ffaa7215d4e179d8a7a4335ac6699627f3&state=qByQ5R8CCmnNjTVZSDOg7Q#_=_

async function onClickConnect() {
    console.log("onClickConnect triggered.")
    // exit();
    try {
        let accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
        current_address = accounts[0];
        console.log(current_address);
    }
    catch (error) {
        console.error(error);
    }
  
    console.log("You are connected to MetaMask.");
    closeBanner()
      
    const chainId = await ethereum.request({
        method: "eth_chainId",
    });

    // else if (name === "rinkeby" && chainId === 4) { await notification("You are currently on the rinkeby test network", false) }
    // else {
    //     await notification("Currently not on the supported schain, Dapp functionality will not work as expected", false)
    // }
}

async function getAuthAndProceed() {
    const { state, code_verifier } = getFitbitCredentials();
    console.log("getAuthAndProceed")
    console.log(state, code_verifier)
    const { access_token, refresh_token, scope, user_id } = await get_access_token(window.location.href, code_verifier);
    console.log(access_token, refresh_token, scope, user_id)
    storeFitbitCredentials(state, code_verifier, access_token, "fitbit");
    console.log("stored credentials")
    console.log("calling proceed")
    await proceed();


}

window.addEventListener("load", async () => {
    // console.log("window loaded")
    console.log("window loaded")
    await notification("⌛ Loading...");
    await connectMetaMaskWallet();

    const url = new URL(window.location.href);

    if ("code" in url.searchParams) {
        const params = new URLSearchParams(url.search);
        const code = params.get('code');
        const state = params.get('state');
        console.log(code, state)


    }





});
